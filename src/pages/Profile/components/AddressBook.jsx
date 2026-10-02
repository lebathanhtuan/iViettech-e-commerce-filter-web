import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Card, Checkbox, Empty, Form, Input, Modal, Popconfirm, Space, Spin, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AddressFields from '../../../components/AddressFields'
import { getAddressListThunk, createAddressThunk, updateAddressThunk, deleteAddressThunk, setDefaultAddressThunk } from '../../../redux/thunks/address.thunk'

function AddressBook() {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [editor, setEditor] = useState(null)
  const { data: addresses, loading, error } = useSelector((state) => state.address.addressList)
  const { loading: saving } = useSelector((state) => state.address.mutation)
  const { data: user } = useSelector((state) => state.auth.userInfo)

  useEffect(() => { dispatch(getAddressListThunk()) }, [dispatch])

  const openEditor = (address) => {
    setEditor(address || {})
    form.resetFields()
    form.setFieldsValue(address || { fullName: user?.name, phone: user?.phone, isDefault: addresses.length === 0 })
  }

  const handleSave = async (values) => {
    try {
      const thunk = editor.id ? updateAddressThunk({ ...values, id: editor.id }) : createAddressThunk(values)
      await dispatch(thunk).unwrap()
      setEditor(null)
      message.success('Lưu địa chỉ thành công')
    } catch (error) { message.error(error) }
  }

  const handleAction = async (thunk, successMessage) => {
    try {
      await dispatch(thunk).unwrap()
      message.success(successMessage)
    } catch (error) { message.error(error) }
  }

  return (
    <>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <h3>Sổ địa chỉ</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()} disabled={saving || loading || Boolean(error)}>Thêm địa chỉ</Button>
      </Space>
      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }}
        action={<Button onClick={() => dispatch(getAddressListThunk())}>Thử lại</Button>} />}
      <Spin spinning={loading}>
        {!loading && !error && addresses.length === 0 && <Empty description="Bạn chưa có địa chỉ. Địa chỉ đầu tiên sẽ được đặt làm mặc định." />}
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          {addresses.map((address) => (
            <Card key={address.id} size="small">
              <Space wrap><strong>{address.fullName}</strong><span>{address.phone}</span>
                {address.label && <Tag>{address.label}</Tag>}
                {address.isDefault && <Tag color="blue">Mặc định</Tag>}
              </Space>
              <p style={{ margin: '12px 0' }}>{address.fullAddress}</p>
              <Space wrap>
                <Button size="small" onClick={() => openEditor(address)} disabled={saving}>Sửa</Button>
                {!address.isDefault && <Button size="small" disabled={saving}
                  onClick={() => handleAction(setDefaultAddressThunk(address.id), 'Đã đặt địa chỉ mặc định')}>Đặt làm mặc định</Button>}
                <Popconfirm title="Xóa địa chỉ này?" description={address.isDefault ? 'Địa chỉ còn lại đầu tiên sẽ trở thành mặc định.' : undefined}
                  okText="Xóa" cancelText="Hủy" onConfirm={() => handleAction(deleteAddressThunk(address.id), 'Đã xóa địa chỉ')}>
                  <Button size="small" danger disabled={saving}>Xóa</Button>
                </Popconfirm>
              </Space>
            </Card>
          ))}
        </Space>
      </Spin>
      <Modal title={editor?.id ? 'Sửa địa chỉ' : 'Thêm địa chỉ'} open={Boolean(editor)}
        onCancel={() => { if (!saving) setEditor(null) }} onOk={() => form.submit()}
        okText="Lưu địa chỉ" cancelText="Hủy" confirmLoading={saving} forceRender>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Tên gợi nhớ (không bắt buộc)" name="label" rules={[{ max: 100 }]}>
            <Input placeholder="Nhà riêng, Công ty..." maxLength={100} />
          </Form.Item>
          <AddressFields form={form} />
          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox disabled={editor?.isDefault || addresses.length === 0}>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddressBook
