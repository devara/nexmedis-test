<template>
  <div class="flex flex-col space-y-6">
    <h4>User Task</h4>

    <Card class="!flex-row space-x-3 items-end">
      <Field
        v-model="taskTitle"
        label="task title" />

      <Field
        v-model="taskDescription"
        label="task description" />

      <button
        class="flex items-center justify-center h-12 px-2 space-x-3 text-blue-500 border border-blue-500 min-w-20 hover:text-white hover:bg-blue-500"
        @click="processActionTask">
        <span>{{ formMode === 'add' ? 'Create' : 'Update' }}</span>
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
        <table class="activity__table">
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
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>{{ task.by.name }}</td>
              <td>
                <Dropdown
                  :model-value="task.status"
                  :options="statusOptions"
                  @update:model-value="onChangeStatus(task._id, $event)" />
              </td>
              <td>{{ format(task.createdAt, 'PPpp') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {
  PencilSquareIcon,
  TrashIcon,
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
  page      : 1,
  per_page  : 10,
  total     : 0,
  total_page: 1,
})

const taskID          = ref<string>()
const taskTitle       = ref<string>()
const taskDescription = ref<string>()

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
    const response = await taskRepository.get()
    tasks.value    = response.data ?? []
    pageMeta.value = response.meta ?? undefined
  } catch (error) {
    console.error(error)
  }
}

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
    await taskRepository.post({
      title      : taskTitle.value,
      description: taskDescription.value,
    })
    taskTitle.value       = ''
    taskDescription.value = ''

    await getTasks()
  } catch (error) {
    console.error(error)
  }
}

async function processEditTask () {
  if (!taskID.value || !taskTitle.value || !taskDescription.value)
    return

  try {
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
