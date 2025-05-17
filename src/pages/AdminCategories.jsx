import React, { useState } from 'react';
import '../styles/Categories.css';

const AdminCategories = () => {
const [categories, setCategories] = useState([]);
const [newCategory, setNewCategory] = useState({
name: '',
description: '',
imageUrl: ''
});

const handleAddCategory = () => {
const { name, description, imageUrl } = newCategory;
if (!name || !description || !imageUrl) return; // تأكدي من كامل الحقول
const cat = {
id: Date.now(),
...newCategory
};
setCategories([cat, ...categories]);
setNewCategory({ name: '', description: '', imageUrl: '' });
};

return (
<div className="admin-cats-shell">
<h2>Admin Dashboard — Categories</h2>

{/* ▸ Add Category Form */}
<div className="form-section">
<h3>Add New Category</h3>
<input
type="text"
placeholder="Category Name"
value={newCategory.name}
onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
/>
<textarea
placeholder="Description"
value={newCategory.description}
onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
/>
<input
type="text"
placeholder="Image URL"
value={newCategory.imageUrl}
onChange={e => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
/>
<button onClick={handleAddCategory}>Add Category</button>
</div>

<hr />

{/* ▸ Categories List */}
<div className="cats-grid">
{categories.length === 0 && <p className="empty">No categories yet.</p>}
{categories.map(cat => (
<div key={cat.id} className="cat-card">
<img src={cat.imageUrl} alt={cat.name} />
<h4>{cat.name}</h4>
<p>{cat.description}</p>
</div>
))}
</div>
</div>
);
};

export default AdminCategories;




