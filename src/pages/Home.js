import React, { useEffect, useState } from "react";
import { Space, Table, Button, Input, Form, message } from "antd";
import HomeModal from "./components/HomeModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data.data || []);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      message.error("Kişiler alınamadı!");
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEdit = (value) => {
    form.setFieldsValue(value);
    setEditingContact(value);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/v1/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
      console.log("Kişi silme Başarılı");
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleSave = async (values) => {
    const token = localStorage.getItem("token");

    try {
      if (editingContact) {
        await axios.put(
          `http://localhost:5000/api/v1/user/update/${editingContact._id}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Kişi güncelleme Başarılı");
      } else {
        await axios.post("http://localhost:5000/api/v1/user/create", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchContacts();
      setIsModalOpen(false);
      console.log("Kişi ekleme Başarılı");
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    (contact.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.get("http://localhost:5000/api/v1/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      console.log("Çıkış yapıldı");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Soyad",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Teledon Numarası",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },

    {
      title: "Action",
      key: "action",
      render: (_, value) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(value)}>Düzenle</Button>
          <Button danger onClick={() => handleDelete(value._id)}>
            Sil
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: "10px 10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Telefon Numaraları</h1>

        <Button danger onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </div>
      <Space style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Kullanıcı Ara"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleAdd}>Kişi Ekle</Button>
      </Space>
      <Table columns={columns} dataSource={filteredContacts} />
      <HomeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSave={handleSave}
        form={form}
        editingContact={editingContact}
      />
    </div>
  );
}
