import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HelpPage.css";

const HelpPage = () => {
  const [helpPosts, setHelpPosts] = useState([]);
  const [formData, setFormData] = useState({
    heading: "",
    content: "",
    status: "active",
    helped: false,
    helper: null,
    author: "tester"
  });
  const[message, setMessage] = useState("")
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchHelpPosts();
  }, []);

  const fetchHelpPosts = async () => {
    try {
      const response = await axios.get("https://ihelpapi.onrender.com/help/get");
      setHelpPosts(response.data);
    } catch (error) {
      console.error("Error fetching help posts:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.post(`https://ihelpapi.onrender.com/help/edit/${editId}`, formData);
        setEditId(null);
        setMessage("Post updated successfully")
      } else {
        await axios.post("https://ihelpapi.onrender.com/help/create", formData);
        setMessage("Post created successfully")
      }
      setFormData({
        heading: "",
        content: "",
        status: "active",
        helped: false,
        helper: null,
        author: "tester"
      });
      fetchHelpPosts();
    } catch (error) {
      console.error("Error saving help post:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ihelpapi.onrender.com/help/delete/${id}`);
      fetchHelpPosts();
      setMessage("Post deleted successfully")
    } catch (error) {
      console.error("Error deleting help post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setFormData({
      heading: post.heading || "",
      content: post.content || "",
      status: post.status || "active",
      helped: post.helped || false,
      helper: post.helper || null,
    });
  };

  return (
    <div>
      <h1>Help Posts</h1>
      <h2>React Assignment 1, 2, 3 & 4.</h2>
      <h3>API for CURD operation on HelpPost entity</h3>
      <h3>Backend running on Python FastAPI and MongoDB database</h3>
    <p>{message }</p>
      <ul>
        {helpPosts.map((post) => (
          <li key={post._id}>
            <h3>{post.heading}</h3>
            <p>{post.content}</p>
            <p><strong>Status:</strong> {post.status}</p>
            <p><strong>Helped:</strong> {post.helped ? "Yes" : "No"}</p>
            <p><strong>Helper:</strong> {post.helper || "None"}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>{editId ? "Edit Help Post" : "Create Help Post"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Heading:</label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label>Helped:</label>
          <input
            type="checkbox"
            name="helped"
            checked={formData.helped}
            onChange={(e) =>
              setFormData({ ...formData, helped: e.target.checked })
            }
          />
        </div>
        <div>
          <label>Helper:</label>
          <input
            type="text"
            name="helper"
            value={formData.helper || ""}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">{editId ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default HelpPage;