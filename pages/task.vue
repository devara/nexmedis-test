<template>
  <div class="flex flex-col space-y-6">
    <h4>User Task</h4>

    <Card class="!flex-row gap-3 items-end flex-wrap">
      <Field
        v-model="taskTitle"
        label="task title" />

      <Field
        v-model="taskDescription"
        label="task description" />

      <button
        class="flex items-center justify-center h-12 min-w-[150px] px-2 space-x-3 text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"
        @click="processActionTask">
        <span>{{ formMode === 'add' ? 'Create' : 'Update' }}</span>
        <ArrowPathIcon
          v-if="actionLoading"
          class="size-5 animate-spin" />
      </button>
      <button
        v-if="formMode === 'edit'"
        class="flex items-center justify-center h-12 px-2 space-x-2 text-white bg-red-600"
        @click="doCancelEdit">
        <span>Cancel</span>
      </button>
    </Card>

    <Card>
      <div class="flex flex-col space-y-2">
        <div class="overflow-x-auto overscroll-contain">
          <table class="w-full activity__table">
            <thead>
              <tr class="bg-neutral-300">
                <th>-</th>
                <th>Title</th>
                <th>Description</th>
                <th>By</th>
                <th>Status</th>
                <th>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(task, index) in tasks"
                :key="index">
                <td>
                  <div class="inline-flex space-x-3">
                    <button
                      @click="doEditTask(task)">
                      <PencilSquareIcon class="size-4" />
                    </button>
                    <button
                      @click="onDeleteTask(task._id)">
                      <TrashIcon class="size-4" />
                    </button>
                  </div>
                </td>
                <td class="min-w-[175px]">
                  {{ task.title }}
                </td>
                <td class="min-w-[200px]">
                  {{ task.description }}
                </td>
                <td class="min-w-[175px]">
                  {{ task.by.name }}
                </td>
                <td class="min-w-[150px]">
                  <Dropdown
                    :model-value="task.status"
                    :options="statusOptions"
                    @update:model-value="onChangeStatus(task._id, $event)" />
                </td>
                <td class="min-w-[150px]">
                  {{ format(task.createdAt, 'PPpp') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Pagination
          v-model:page-value="pageMeta.page"
          v-model:per-page-value="pageMeta.per_page"
          :total="pageMeta.total"
          :total-page="pageMeta.total_pages" />
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { taskRepository } from '~/repository/modules/task'
import type { ApiResponsePaging } from '~/types'
import type { TaskStatus, UserTask } from '~/types/task'
import { format } from 'date-fns'

interface StatusOption {
  label: string,
  value: TaskStatus,
}

const tasks = ref<UserTask[]>([])

const pageMeta = ref<ApiResponsePaging>({
  page       : 1,
  per_page   : 10,
  total      : 0,
  total_pages: 1,
})

const taskID          = ref<string>()
const taskTitle       = ref<string>()
const taskDescription = ref<string>()

const actionLoading = ref<boolean>(false)

const formMode = ref<'add' | 'edit'>('add')

const statusOptions = computed<StatusOption[]>(() => {
  return [
    {
      label: 'On going',
      value: 'ONGOING',
    },
    {
      label: 'On hold',
      value: 'HOLD',
    },
    {
      label: 'Canceled',
      value: 'CANCEL',
    },
    {
      label: 'Done',
      value: 'DONE',
    },
  ]
})

async function getTasks () {
  try {
    const response = await taskRepository.get({
      params: {
        page    : pageMeta.value.page,
        per_page: pageMeta.value.per_page,
      },
    })
    if (response.data.length > 0) {
      tasks.value    = response.data ?? []
      pageMeta.value = response.meta ?? pageMeta.value
    }
  } catch (error) {
    console.error(error)
  }
}

const currentPage    = computed(() => pageMeta.value.page)
const currentPerPage = computed(() => pageMeta.value.per_page)

watch(currentPage, async (current, old) => {
  if (current !== old)
    await getTasks()
})

watch(currentPerPage, async (current, old) => {
  if (current !== old)
    await getTasks()
})

function doEditTask (task: UserTask) {
  taskID.value          = task._id
  taskTitle.value       = task.title
  taskDescription.value = task.description

  formMode.value = 'edit'
}

function doCancelEdit () {
  taskID.value          = undefined
  taskTitle.value       = ''
  taskDescription.value = ''
  formMode.value        = 'add'
}

function processActionTask () {
  return formMode.value === 'add' ? processCreateTask() : processEditTask()
}

async function processCreateTask () {
  if (!taskTitle.value || !taskDescription.value)
    return

  try {
    actionLoading.value = true
    await taskRepository.post({
      title      : taskTitle.value,
      description: taskDescription.value,
    })
    taskTitle.value       = ''
    taskDescription.value = ''

    await getTasks()
  } catch (error) {
    console.error(error)
  } finally {
    actionLoading.value = false
  }
}

async function processEditTask () {
  if (!taskID.value || !taskTitle.value || !taskDescription.value)
    return

  try {
    actionLoading.value = true
    await taskRepository.put(taskID.value, {
      title      : taskTitle.value,
      description: taskDescription.value,
    })

    tasks.value = tasks.value.map((task) => {
      if (task._id === taskID.value) {
        task.title       = taskTitle.value ?? task.title
        task.description = taskDescription.value ?? task.description
      }

      return task
    })

    doCancelEdit()
  } catch (error) {
    console.error(error)
  } finally {
    actionLoading.value = false
  }
}

async function onChangeStatus (id: string, status: TaskStatus) {
  try {
    await taskRepository.put(id, { status })

    tasks.value = tasks.value.map((task) => {
      if (task._id === id)
        task.status = status

      return task
    })
  } catch (error) {
    console.error(error)
  }
}

async function onDeleteTask (id: string) {
  try {
    await taskRepository.delete(id)

    await getTasks()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await getTasks()
})
</script>
