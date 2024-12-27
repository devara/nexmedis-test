import {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  AxiosHeaders,
} from 'axios'
import {
  ofetch,
  type FetchError,
} from 'ofetch'

class ApiModule {
  private static instance: ApiModule
  private readonly fetchOptions: RequestInit = {}
  private baseUrl: string
  private readonly requestInterceptors: Array<(config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>> = []
  private readonly responseInterceptors: Array<{
    onFulfilled: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: FetchError) => Promise<never>,
  }> = []

  constructor (baseUrl: string) {
    this.baseUrl = baseUrl

    this.addResponseInterceptor(
      (response) => {
        return response
      },
      async (error) => {
        if (error.response?.status === 401)
          console.error('Unauthorized access - redirecting to login')

        throw error
      },
    )
  }

  public setBaseUrl (baseUrl: string): void {
    this.baseUrl = baseUrl
  }

  public static getInstance (baseUrl?: string): ApiModule {
    if (!ApiModule.instance)
      ApiModule.instance = new ApiModule(baseUrl ?? '')

    return ApiModule.instance
  }

  public addRequestInterceptor (interceptor: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>): void {
    this.requestInterceptors.push(interceptor)
  }

  public addResponseInterceptor (
    onFulfilled: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: FetchError) => Promise<never>,
  ): void {
    this.responseInterceptors.push({ onFulfilled, onRejected })
  }

  private async applyRequestInterceptors (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    for (const interceptor of this.requestInterceptors)
      config = await interceptor(config)

    return config
  }

  private async applyResponseInterceptors<T> (response: AxiosResponse<T>): Promise<AxiosResponse<T>> {
    for (const { onFulfilled } of this.responseInterceptors)
      response = await onFulfilled(response)

    return response
  }

  private async applyErrorInterceptors (error: FetchError): Promise<never> {
    for (const { onRejected } of this.responseInterceptors) {
      if (onRejected)
        return await onRejected(error)
    }
    throw error
  }

  private async request<T>(config: InternalAxiosRequestConfig): Promise<T> {
    const finalConfig = await this.applyRequestInterceptors(config)

    try {
      const headers = new Headers(config.headers ?? {})

      const response = await ofetch.raw<T>(config.url ?? '/', {
        baseURL: this.baseUrl,
        headers,
        body   : config.data,
        method : config.method,
        params : config.params,
      })

      const axiosResponse: AxiosResponse<T> = {
        data      : response._data as T,
        status    : response.status,
        statusText: response.statusText,
        headers   : Object.fromEntries(response.headers.entries()),
        config    : finalConfig,
      }

      const resInterceptors = await this.applyResponseInterceptors<T>(axiosResponse)

      return resInterceptors.data
    } catch (error) {
      return await this.applyErrorInterceptors(error as FetchError)
    }
  }

  private applyInternalConfig (config: AxiosRequestConfig = {}): InternalAxiosRequestConfig {
    return {
      ...config,
      headers: new AxiosHeaders({
        'Content-Type': 'application/json',
        ...config.headers,
      }),
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>({
      ...this.applyInternalConfig(config), url, method: 'GET',
    })
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>({
      ...this.applyInternalConfig(config), url, method: 'POST', data,
    })
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>({
      ...this.applyInternalConfig(config), url, method: 'PUT', data,
    })
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>({
      ...this.applyInternalConfig(config), url, method: 'DELETE',
    })
  }
}

export const createApi = (config?: AxiosRequestConfig) => {
  return ApiModule.getInstance(config?.baseURL)
}
