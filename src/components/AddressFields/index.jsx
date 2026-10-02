import { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Input, Row, Select } from 'antd'
import { getProvinces, getWards } from '../../services/locationService'

// Dùng chung cho Sổ địa chỉ và địa chỉ nhập mới khi checkout.
function AddressFields({ form, disabled = false }) {
  const provinceCode = Form.useWatch('provinceCode', form)
  const [provinceList, setProvinceList] = useState({ data: [], loading: true, error: null })
  const [wardList, setWardList] = useState({ code: null, data: [], loading: false, error: null })
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    getProvinces().then((data) => {
      if (active) setProvinceList({ data, loading: false, error: null })
    }).catch((error) => {
      if (active) setProvinceList({ data: [], loading: false, error: error.response?.data?.message || 'Không tải được tỉnh/thành' })
    })
    return () => { active = false }
  }, [retry])

  useEffect(() => {
    if (!provinceCode) return
    let active = true
    getWards(provinceCode).then((data) => {
      if (active) setWardList({ code: provinceCode, data, loading: false, error: null })
    }).catch((error) => {
      if (active) setWardList({ code: provinceCode, data: [], loading: false, error: error.response?.data?.message || 'Không tải được phường/xã' })
    })
    return () => { active = false }
  }, [provinceCode, retry])

  const wards = wardList.code === provinceCode ? wardList : { data: [], loading: Boolean(provinceCode), error: null }
  const error = provinceList.error || wards.error

  return (
    <>
      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }}
        action={<Button size="small" onClick={() => setRetry((value) => value + 1)}>Thử lại</Button>} />}
      <Form.Item label="Họ tên người nhận" name="fullName"
        rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập họ tên' }, { max: 100 }]}>
        <Input placeholder="Nhập họ tên" maxLength={100} disabled={disabled} />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phone"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { pattern: /^0\d{9}$/, message: 'Số điện thoại gồm 10 số, bắt đầu bằng 0' }]}>
        <Input placeholder="Nhập số điện thoại" maxLength={10} disabled={disabled} />
      </Form.Item>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Tỉnh / Thành phố" name="provinceCode" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành' }]}>
            <Select showSearch optionFilterProp="label" placeholder="Chọn tỉnh/thành" disabled={disabled}
              loading={provinceList.loading} options={provinceList.data.map((item) => ({ value: item.code, label: item.name }))}
              onChange={() => form.setFieldsValue({ wardCode: undefined })} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Phường / Xã / Đặc khu" name="wardCode" rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}>
            <Select showSearch optionFilterProp="label" placeholder="Chọn phường/xã"
              disabled={disabled || !provinceCode || Boolean(wards.error)} loading={wards.loading}
              options={wards.data.map((item) => ({ value: item.code, label: item.name }))} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Địa chỉ chi tiết" name="addressLine"
        rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập địa chỉ chi tiết' }, { max: 160 }]}>
        <Input.TextArea rows={2} maxLength={160} showCount placeholder="Số nhà, tên đường, thôn / tổ dân phố..." disabled={disabled} />
      </Form.Item>
    </>
  )
}

export default AddressFields
