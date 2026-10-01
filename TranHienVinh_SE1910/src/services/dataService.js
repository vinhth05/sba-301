import { initialUsers, initialCategories, initialNews } from '../data/mockData';

// Utility to get/set local storage
const getStorage = (key, initialValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initialValue;
};

const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const dataService = {
  // Authentication
  login: (username, password) => {
    const users = getStorage('users', initialUsers);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      if (user.status !== 1) return { success: false, message: 'Account is inactive.' };
      if (user.role !== 1) return { success: false, message: 'Only Admin can login to this system.' };
      setStorage('currentUser', user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials.' };
  },
  logout: () => {
    localStorage.removeItem('currentUser');
  },
  getCurrentUser: () => getStorage('currentUser', null),

  // Categories
  getCategories: () => getStorage('categories', initialCategories),
  addCategory: (category) => {
    const categories = getStorage('categories', initialCategories);
    categories.push(category);
    setStorage('categories', categories);
  },
  updateCategory: (id, updated) => {
    const categories = getStorage('categories', initialCategories).map(c => c.id === id ? { ...c, ...updated } : c);
    setStorage('categories', categories);
  },
  deleteCategory: (id) => {
    const categories = getStorage('categories', initialCategories).filter(c => c.id !== id);
    setStorage('categories', categories);
  },

  // News
  getNews: () => getStorage('news', initialNews),
  addNews: (newsItem) => {
    const news = getStorage('news', initialNews);
    news.push(newsItem);
    setStorage('news', news);
  },
  updateNews: (id, updated) => {
    const news = getStorage('news', initialNews).map(n => n.id === id ? { ...n, ...updated } : n);
    setStorage('news', news);
  },
  deleteNews: (id) => {
    const news = getStorage('news', initialNews).filter(n => n.id !== id);
    setStorage('news', news);
  },

  // Users
  getUsers: () => getStorage('users', initialUsers),
  addUser: (user) => {
    const users = getStorage('users', initialUsers);
    users.push(user);
    setStorage('users', users);
  },
  updateUser: (id, updated) => {
    const users = getStorage('users', initialUsers).map(u => u.id === id ? { ...u, ...updated } : u);
    setStorage('users', users);
  },
  deleteUser: (id) => {
    const users = getStorage('users', initialUsers).filter(u => u.id !== id);
    setStorage('users', users);
  }
};
