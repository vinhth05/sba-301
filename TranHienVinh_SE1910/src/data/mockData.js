export const initialUsers = [
  { id: 'u1', username: 'Admin', password: '123', role: 1, status: 1 },
  { id: 'u2', username: 'Staff', password: '123', role: 2, status: 1 }
];

export const initialCategories = [
  { id: 'c1', name: 'Technology', status: 1 },
  { id: 'c2', name: 'Business', status: 1 },
  { id: 'c3', name: 'Health', status: 0 }
];

export const initialNews = [
  { id: 'n1', title: 'React 19 Release', content: 'React 19 is coming...', categoryId: 'c1', createdBy: 'u1', status: 1, tags: 'react, frontend' },
  { id: 'n2', title: 'Stock Market Up', content: 'Tech stocks are up today.', categoryId: 'c2', createdBy: 'u2', status: 1, tags: 'finance, tech' }
];
