import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import ContactServer from "../../redux/service/ContactUsService";

const GetContact = () => {
  const [contacts, setContacts] = useState([]); // State to store contact messages
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all contact messages
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await ContactServer.getContact();
      setContacts(response.data); // Assuming the API returns an array of contact messages
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      message.error("Failed to load contact messages.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(); // Fetch contacts on component mount
  }, []);

  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(), // Format date
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
      <Table
        dataSource={contacts}
        columns={columns}
        rowKey={(record) => record.id} // Use a unique key for each row
        loading={loading}
        bordered
      />
    </div>
  );
};

export default GetContact;