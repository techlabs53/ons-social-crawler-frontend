<template>
  <div
    class="modal fade du-custom"
    tabindex="-1"
    id="kt_modal_user_edit"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <Form
          ref="form"
          @submit="onSubmit"
          :validation-schema="validationSchema"
          :initial-values="initialValues"
          v-slot="{ errors }"
        >
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row gy-3">
              <div class="col-12 col-md-6">
                <label for="name" class="form-label required">{{
                  $t('entities.users.fullName')
                }}</label>
                <Field
                  type="text"
                  class="form-control"
                  id="name"
                  name="name"
                  :placeholder="$t('common.insertValue')"
                  :class="{ 'is-invalid': errors.name }"
                />
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>
              <div class="col-12 col-md-6">
                <label for="email" class="form-label required">{{
                  $t('entities.users.email')
                }}</label>
                <Field
                  type="text"
                  class="form-control"
                  id="email"
                  name="email"
                  :placeholder="$t('common.insertValue')"
                  :class="{ 'is-invalid': errors.email }"
                />
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="col-12 col-md-6">
                <label for="roles" class="form-label required">{{
                  $t('entities.users.roles')
                }}</label>
                <Field id="roles" name="roles" v-slot="{ field }">
                  <el-select
                    v-bind="field"
                    v-model="field.value"
                    multiple
                    :placeholder="$t('common.insertValue')"
                    class="form-control"
                    :class="{ 'is-invalid': errors.roles }"
                    size="large"
                  >
                    <el-option v-for="item in userRoles" :key="item" :label="item" :value="item" />
                  </el-select>
                </Field>
                <div class="invalid-feedback">
                  {{ errors.roles }}
                </div>
              </div>

              <div class="d-none d-md-block col-md-6"></div>

              <div class="col-12 col-md-6">
                <label for="password" class="form-label required">{{
                  $t('entities.users.password')
                }}</label>
                <Field
                  type="password"
                  class="form-control"
                  id="password"
                  name="password"
                  :placeholder="$t('common.insertValue')"
                  :class="{ 'is-invalid': errors.password }"
                />
                <div class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <div class="col-12 col-md-6">
                <label for="passwordConfirmation" class="form-label required">{{
                  $t('entities.users.passwordConfirmation')
                }}</label>
                <Field
                  type="password"
                  class="form-control"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  :placeholder="$t('common.insertValue')"
                  :class="{ 'is-invalid': errors.passwordConfirmation }"
                />
                <div class="invalid-feedback">
                  {{ errors.passwordConfirmation }}
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              {{ $t('common.close') }}
            </button>
            <button type="submit" class="btn btn-primary">
              {{ $t('common.confirm') }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useLoadingStore } from '@/stores/loading'
import ApiService from '@/core/services/ApiService'
import { getModalInstance, hideModal } from '@/core/helpers/dom'
import alert from '@/core/helpers/alert'

export default defineComponent({
  name: 'modal-user-edit',
  components: {
    Form,
    Field
  },
  props: {
    id: { default: '' }
  },
  emits: ['closeModal'],
  setup(props, context) {
    const { operationConfirm, dangerAlert } = alert()
    const { t } = useI18n()
    const loading = useLoadingStore()
    const id = computed(() => props.id)
    const form = ref(null)
    const userRoles = ref(['Admin', 'Teacher', 'Trainer'])
    const initialValues = ref({
      name: '',
      email: '',
      roles: [],
      password: '',
      passwordConfirmation: ''
    })

    onMounted(() => {
      const modal = getModalInstance('kt_modal_user_edit')
      modal.addEventListener('show.bs.modal', async () => {
        await init()
      })
      modal.addEventListener('hide.bs.modal', () => {
        context.emit('closeModal')
      })
    })

    const validationSchema = Yup.object().shape({
      name: Yup.string().required(t('common.requiredField')),
      email: Yup.string().email(t('common.validEmail')).required(t('common.requiredField')),
      roles: Yup.array().min(1, t('common.requiredField')),
      password: Yup.string()
        .transform((o, v) => v || null)
        .when('id', {
          is: () => isEdit.value,
          then: (schema) => schema.notRequired().min(6, t('entities.users.passwordMinLength')),
          otherwise: (schema) =>
            schema.min(6, t('entities.users.passwordMinLength')).required(t('common.requiredField'))
        }),
      passwordConfirmation: Yup.string()
        .transform((o, v) => v || null)
        .when('password', {
          is: (val) => val === null,
          then: (schema) => schema.notRequired(),
          otherwise: (schema) =>
            schema
              .required(t('common.requiredField'))
              .oneOf([Yup.ref('password')], t('common.passwordsDoNotMatch'))
        })
    })

    const onSubmit = async (values) => {
      loading.show()
      try {
        const data = {
          id: 0,
          displayName: values.name ?? '',
          email: values.email ?? '',
          password: values.password || null,
          passwordConfirmation: values.passwordConfirmation || null,
          userRoles: values.roles ?? []
        }
        if (isEdit.value) {
          data.uid = id.value
          await ApiService.put('/auth', data)
        } else {
          await ApiService.post('/auth', data)
        }
        form.value.resetForm()
        loading.hide()
        operationConfirm().then(() => {
          hideModal('kt_modal_user_edit')
        })
      } catch (e) {
        dangerAlert(e)
      } finally {
        loading.hide()
      }
    }

    const init = async () => {
      loading.show()
      form.value.resetForm()
      try {
        initialValues.value.name = ''
        initialValues.value.email = ''
        initialValues.value.roles = []
        initialValues.value.password = null
        initialValues.value.passwordConfirmation = null

        if (isEdit.value) {
          const data = await ApiService.get('/auth', id.value)
          initialValues.value.name = data.data.displayName || ''
          initialValues.value.email = data.data.email || ''
          initialValues.value.roles = data.data.customClaims?.user || []
        }
      } catch (e) {
        dangerAlert(e)
      } finally {
        loading.hide()
      }
    }

    const isEdit = computed(() => id.value != '')

    const title = computed(() =>
      isEdit.value ? t('entities.users.edit') : t('entities.users.add')
    )

    return {
      form,
      validationSchema,
      initialValues,
      title,
      onSubmit,
      userRoles,
      isEdit
    }
  }
})
</script>
