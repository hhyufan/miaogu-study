<template>
  <div class="new-note-viewer-container">
    <h2 class="viewer-title">{{ t('newNoteViewer.title') }}</h2>

    <el-form ref="formRef" :model="form" :rules="rules" class="new-note-form" label-width="88px">
      <el-row :gutter="12" class="form-row">
        <el-col :span="10">
          <el-form-item :label="t('newNoteViewer.form.id')" prop="id">
            <el-input
              v-model="form.id"
              :placeholder="t('newNoteViewer.form.idPlaceholder')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="t('newNoteViewer.form.name')" prop="name">
            <el-input
              v-model="form.name"
              :placeholder="t('newNoteViewer.form.namePlaceholder')"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12" class="form-row">
        <el-col :span="12">
          <el-form-item :label="t('newNoteViewer.form.group')" prop="selectedGroup" required>
            <el-select
              v-model="form.selectedGroup"
              :placeholder="t('newNoteViewer.form.groupPlaceholder')"
              allow-create
              default-first-option
              filterable
              style="width: 100%"
            >
              <el-option v-for="g in availableGroups" :key="g" :label="g" :value="g" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('newNoteViewer.form.tags')">
            <el-select
              v-model="form.tags"
              :placeholder="t('newNoteViewer.form.tagsPlaceholder')"
              allow-create
              default-first-option
              filterable
              multiple
              style="width: 100%"
            >
              <el-option v-for="tag in availableTags" :key="tag" :label="tag" :value="tag" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="t('newNoteViewer.form.markdown')" prop="file">
        <el-upload
          :auto-upload="false"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :limit="1"
          :multiple="false"
          :on-change="handleChange"
          :show-file-list="true"
          accept=".md"
          action="#"
          class="upload-area"
          drag
        >
          <IconUploadFilled class="app-icon app-icon--lg" />
          <div class="el-upload__text">
            {{ t('newNoteViewer.upload.dragTextPrefix') }}
            <em>{{ t('newNoteViewer.upload.clickToImport') }}</em>
          </div>
          <div class="el-upload__tip">{{ t('newNoteViewer.upload.tip') }}</div>
        </el-upload>
      </el-form-item>

      <div class="actions">
        <el-button type="primary" @click="submit">{{ t('newNoteViewer.actions.save') }}</el-button>
        <el-button :disabled="submitting" @click="resetForm">{{
          t('newNoteViewer.actions.reset')
        }}</el-button>
      </div>
    </el-form>

    <div v-if="createdId" class="created-info">
      {{ t('newNoteViewer.created.prefix') }}<span class="note-id">{{ createdId }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useNotesStore } from '@/stores/notes'
import { useUserStore } from '@/stores/user'
import chaptersData from '@/data/chapters.json'
import noteData from '@/data/note.json'
import notesIndex from '@/data/notes-index.json'
import { IconUploadFilled } from '@/components/icons'

const emit = defineEmits<{
  (e: 'note-created', payload: { id: string; username: string; group: string }): void
}>()

type FileListItem = any

const notesStore = useNotesStore()
const userStore = useUserStore()
const { t } = useI18n()
const username = computed(() => userStore.userInfo?.username || 'miaogu')
const staticGroups = computed(() => {
  const data: any = chaptersData as any
  const userChapters = data?.userChapters?.[username.value] || data?.defaultChapters || []
  const titles = (userChapters as any[]).map((c) => String(c?.title || '').trim()).filter(Boolean)
  return Array.from(new Set(titles))
})
const availableGroups = computed(() => {
  const dyn = notesStore.listGroups(username.value)
  return Array.from(new Set([...(staticGroups.value || []), ...(dyn || [])]))
})
const staticTags = computed(() => {
  const data: any = noteData as any
  const list: string[] = []
  for (const key of Object.keys(data || {})) {
    const n = data[key]
    if (n?.author === username.value && Array.isArray(n?.tags)) {
      list.push(...n.tags.map((t: any) => String(t || '').trim()).filter((t: string) => !!t))
    }
  }
  return Array.from(new Set(list))
})
const availableTags = computed(() => {
  const dyn = notesStore.listTags(username.value)
  return Array.from(new Set([...(staticTags.value || []), ...(dyn || [])]))
})

const formRef = ref<FormInstance>()
const submitting = ref(false)
const createdId = ref('')

const form = reactive({
  id: '',
  name: '',
  selectedGroup: '',
  tags: [] as string[],
})

const fileList = ref<FileListItem[]>([])
const fileName = ref('')
const fileContent = ref('')

const rules: FormRules = {
  selectedGroup: [
    {
      required: true,
      message: t('newNoteViewer.validation.chooseOrEnterGroup'),
      trigger: 'change',
    },
  ],
}

const beforeUpload = (file: File) => {
  const extOk = file.name.toLowerCase().endsWith('.md')
  const mimeOk = ['text/markdown', 'text/plain'].includes(file.type)
  if (!extOk && !mimeOk) {
    ElMessage.error(t('newNoteViewer.messages.mdOnly'))
    return false
  }
  return true
}

const handleChange = (uploadFile: any, uploadFiles: any[]) => {
  // 仅保留单文件
  fileList.value = uploadFiles.slice(-1)
  const raw: File | undefined = uploadFile?.raw
  if (!raw) return
  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = String(e.target?.result || '')
    fileName.value = raw.name
  }
  reader.onerror = () => {
    ElMessage.error(t('newNoteViewer.messages.readFail'))
  }
  reader.readAsText(raw)
}

const resetForm = () => {
  form.id = ''
  form.name = ''
  form.selectedGroup = ''
  form.tags = []
  fileList.value = []
  fileName.value = ''
  fileContent.value = ''
  createdId.value = ''
}

const submit = async () => {
  if (!formRef.value) return
  try {
    submitting.value = true
    await formRef.value.validate()
    if (!fileContent.value) {
      ElMessage.error(t('newNoteViewer.messages.uploadRequired'))
      submitting.value = false
      return
    }

    // 如果用户自定义了笔记ID，检查是否与现有笔记冲突（动态 + 静态）
    const customId = String(form.id || '').trim()
    if (customId) {
      const dynExists = !!(
        notesStore.notes.value && (notesStore.notes.value as Record<string, any>)[customId]
      )
      const staticExists = !!(notesIndex as Record<string, string>)[customId]
      if (dynExists || staticExists) {
        ElMessage.error(t('newNoteViewer.messages.idExists', { id: customId }))
        submitting.value = false
        return
      }
    }

    const displayName = form.name?.trim() || fileName.value?.replace(/\.md$/i, '') || ''
    const finalId = notesStore.addNote({
      id: form.id,
      name: displayName,
      content: fileContent.value,
      filename: fileName.value,
      group: form.selectedGroup?.trim(),
      tags: form.tags,
      username: username.value,
    })
    createdId.value = finalId
    ElMessage.success(t('newNoteViewer.messages.saveSuccess'))
    emit('note-created', {
      id: finalId,
      username: username.value,
      group: form.selectedGroup?.trim(),
    })
    // 可按需保留表单或清空
    // resetForm()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // 校验失败或其它错误
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.new-note-viewer-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.viewer-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-primary);
}

.new-note-form {
  padding: 12px;
  margin: 12px;
}

.upload-area {
  width: 100%;
}
.upload-icon {
  font-size: 28px;
  color: var(--home-link-color);
}

/* 覆盖 Element Plus 拖拽上传样式，适配主题变量 */
.upload-area :deep(.el-upload-dragger) {
  background: transparent; /* 取消背景 */
  border: 1px dashed var(--border-color);
  color: var(--text-secondary);
}
.upload-area :deep(.el-upload-dragger:hover) {
  border-color: var(--home-link-color);
}
.upload-area :deep(.el-upload__text) {
  color: var(--text-secondary);
}
.upload-area :deep(.el-upload__text em) {
  color: var(--home-link-color);
}
.upload-area :deep(.el-upload__tip) {
  color: var(--text-tertiary);
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  /* 与表单项内容区左侧对齐（label-width: 88px） */
  margin-left: 88px;
}

.created-info {
  margin-top: 6px;
  font-size: 13px;
}
.note-id {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

/* 输入框与选择框取消背景 */
.new-note-form :deep(.el-input__wrapper),
.new-note-form :deep(.el-select .el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1px solid var(--border-color);
}

/* 标签输入框中的标签适配主题并取消背景 */
.new-note-form :deep(.el-select__tags .el-tag) {
  background-color: transparent;
  color: var(--home-link-color);
  border: 1px solid var(--home-link-color);
  border-radius: 12px;
}
.new-note-form :deep(.el-select__tags .el-tag .el-tag__close) {
  color: var(--home-link-color);
  background: transparent;
}

/* 下拉列表弹出层取消背景（全局作用于选择下拉） */
:global(.el-select__popper .el-select-dropdown) {
  background-color: transparent;
  border: 1px solid var(--border-color);
}
:global(.el-select__popper .el-select-dropdown__item) {
  color: var(--text-primary);
}
</style>
