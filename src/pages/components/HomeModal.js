import React from "react";
import { Button, Form, Input, Modal } from "antd";

export default function HomeModal({
  isModalOpen,
  setIsModalOpen,
  handleSave,
  form,
}) {
  return (
    <div>
      <Modal
        title="Kullanıcı"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 400 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={handleSave}
          form={form}
        >
          <Form.Item label="Ad" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Soyad" name="lastname">
            <Input />
          </Form.Item>
          <Form.Item label="Telefon Numarası" name="phoneNumber">
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
