import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gallery.db');

// Initialize the database and table
export const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imageUri TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        location TEXT NOT NULL,
        metadata TEXT
      );`,
      [],
      () => console.log('Table created successfully'),
      (_, error) => console.error('Error creating table:', error)
    );
  });
};

// Add a new gallery entry
export const addGalleryItem = (imageUri, timestamp, location, metadata, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO gallery (imageUri, timestamp, location, metadata) VALUES (?, ?, ?, ?);`,
      [imageUri, timestamp, location, metadata],
      (_, result) => {
        console.log('Item added:', result.insertId);
        if (callback) callback(result.insertId);
      },
      (_, error) => console.error('Error adding item:', error)
    );
  });
};

// Fetch all gallery items
export const fetchGalleryItems = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM gallery;`,
      [],
      (_, { rows }) => {
        console.log('Fetched items:', rows._array);
        if (callback) callback(rows._array);
      },
      (_, error) => console.error('Error fetching items:', error)
    );
  });
};

// Update a gallery item by ID
export const updateGalleryItem = (id, imageUri, timestamp, location, metadata, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE gallery SET imageUri = ?, timestamp = ?, location = ?, metadata = ? WHERE id = ?;`,
      [imageUri, timestamp, location, metadata, id],
      (_, result) => {
        console.log('Item updated:', result.rowsAffected);
        if (callback) callback(result.rowsAffected > 0);
      },
      (_, error) => console.error('Error updating item:', error)
    );
  });
};

// Delete a gallery item by ID
export const deleteGalleryItem = (id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM gallery WHERE id = ?;`,
      [id],
      (_, result) => {
        console.log('Item deleted:', result.rowsAffected);
        if (callback) callback(result.rowsAffected > 0);
      },
      (_, error) => console.error('Error deleting item:', error)
    );
  });
};

// Clear all gallery items
export const clearGalleryItems = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM gallery;`,
      [],
      (_, result) => {
        console.log('All items cleared:', result.rowsAffected);
        if (callback) callback(result.rowsAffected > 0);
      },
      (_, error) => console.error('Error clearing items:', error)
    );
  });
};
