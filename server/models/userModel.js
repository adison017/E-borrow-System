import db from '../db.js';

const User = {
  findAll: async () => {
    try {
      const [results] = await db.query(`
        SELECT
          u.user_id,
          u.user_code,
          u.username,
          u.Fullname,
          u.email,
          u.phone,
          u.avatar,
          u.street,
          u.parish,
          u.district,
          u.province,
          u.postal_no,
          u.role_id,
          r.role_name,
          p.position_name,
          b.branch_name,
          u.position_id,
          u.branch_id,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN positions p ON u.position_id = p.position_id
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        ORDER BY u.user_id DESC
      `);
      return results;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [results] = await db.query(`
        SELECT
          u.user_id,
          u.user_code,
          u.username,
          u.Fullname,
          u.email,
          u.phone,
          u.avatar,
          u.street,
          u.parish,
          u.district,
          u.province,
          u.postal_no,
          u.role_id,
          r.role_name,
          p.position_name,
          b.branch_name,
          u.position_id,
          u.branch_id,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN positions p ON u.position_id = p.position_id
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        WHERE u.user_id = ?
      `, [id]);
      return results[0];
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  },

  findByUsername: async (username) => {
    try {
      const [results] = await db.query(`
        SELECT
          u.user_id,
          u.user_code,
          u.username,
          u.Fullname,
          u.email,
          u.phone,
          u.avatar,
          u.street,
          u.parish,
          u.district,
          u.province,
          u.postal_no,
          u.role_id,
          r.role_name,
          p.position_name,
          b.branch_name,
          u.position_id,
          u.branch_id,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN positions p ON u.position_id = p.position_id
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        WHERE u.username = ?
      `, [username]);
      return results[0];
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  },

  findByUserCode: async (userCode) => {
    try {
      const [results] = await db.query(`
        SELECT
          u.user_id,
          u.user_code,
          u.username,
          u.Fullname,
          u.email,
          u.phone,
          u.avatar,
          u.street,
          u.parish,
          u.district,
          u.province,
          u.postal_no,
          u.role_id,
          r.role_name,
          p.position_name,
          b.branch_name,
          u.position_id,
          u.branch_id,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN positions p ON u.position_id = p.position_id
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        WHERE u.user_code = ?
      `, [userCode]);
      return results[0];
    } catch (error) {
      console.error('Error in findByUserCode:', error);
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const [results] = await db.query(`
        SELECT
          u.user_id,
          u.user_code,
          u.username,
          u.Fullname,
          u.email,
          u.phone,
          u.avatar,
          u.street,
          u.parish,
          u.district,
          u.province,
          u.postal_no,
          u.role_id,
          r.role_name,
          p.position_name,
          b.branch_name,
          u.position_id,
          u.branch_id,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN positions p ON u.position_id = p.position_id
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        WHERE u.email = ?
      `, [email]);
      return results[0];
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      // If avatar is provided, ensure it's just the filename
      if (userData.avatar) {
        userData.avatar = userData.avatar.split('/').pop();
      }

      const {
        user_code,
        username,
        email,
        phone,
        position_id,
        branch_id,
        role_id,
        password,
        street,
        province,
        district,
        parish,
        postal_no,
        avatar,
        Fullname
      } = userData;

      // Validate required fields
      if (!user_code || !username || !email || !phone || !Fullname || !password) {
        throw new Error('Missing required fields');
      }

      console.log('Creating user with data:', {
        user_code,
        username,
        email,
        phone,
        position_id,
        branch_id,
        role_id,
        street,
        province,
        district,
        parish,
        postal_no,
        avatar,
        Fullname
      });

      const [result] = await db.query(
        `INSERT INTO users (
          user_code, username, email, phone, position_id, branch_id,
          role_id, password, street, province, district, parish, postal_no, avatar, Fullname
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_code,
          username,
          email,
          phone,
          position_id || null,
          branch_id || null,
          role_id || null,
          password,
          street || '',
          province || '',
          district || '',
          parish || '',
          postal_no || '',
          avatar || null,
          Fullname
        ]
      );

      // Fetch the created user using findById
      const createdUser = await User.findById(result.insertId);
      return createdUser;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const {
        user_code,
        username,
        email,
        phone,
        position_id,
        branch_id,
        role_id,
        password,
        street,
        province,
        district,
        postal_no,
        avatar,
        Fullname
      } = userData;

      const updates = [];
      const values = [];

      if (user_code !== undefined) {
        updates.push('user_code = ?');
        values.push(user_code);
      }
      if (username !== undefined) {
        updates.push('username = ?');
        values.push(username);
      }
      if (email !== undefined) {
        updates.push('email = ?');
        values.push(email);
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone);
      }
      if (position_id !== undefined) {
        updates.push('position_id = ?');
        values.push(position_id);
      }
      if (branch_id !== undefined) {
        updates.push('branch_id = ?');
        values.push(branch_id);
      }
      if (role_id !== undefined) {
        updates.push('role_id = ?');
        values.push(role_id);
      }
      if (password !== undefined) {
        updates.push('password = ?');
        values.push(password);
      }
      if (street !== undefined) {
        updates.push('street = ?');
        values.push(street);
      }
      if (province !== undefined) {
        updates.push('province = ?');
        values.push(province);
      }
      if (district !== undefined) {
        updates.push('district = ?');
        values.push(district);
      }
      if (postal_no !== undefined) {
        updates.push('postal_no = ?');
        values.push(postal_no);
      }
      if (avatar !== undefined) {
        updates.push('avatar = ?');
        values.push(avatar);
      }
      if (Fullname !== undefined) {
        updates.push('Fullname = ?');
        values.push(Fullname);
      }

      if (updates.length === 0) {
        return { affectedRows: 0 };
      }

      values.push(id);
      const [result] = await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
        values
      );
      return result;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  updateByUserCode: async (userCode, userData) => {
    try {
      const {
        avatar
      } = userData;

      const updates = [];
      const values = [];

      if (avatar !== undefined) {
        updates.push('avatar = ?');
        values.push(avatar);
      }

      if (updates.length === 0) {
        return { affectedRows: 0 };
      }

      values.push(userCode);
      const [result] = await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE user_code = ?`,
        values
      );
      return result;
    } catch (error) {
      console.error('Error in updateByUserCode:', error);
      throw error;
    }
  },

  updateById: async (id, userData) => {
    try {
      const {
        user_code,
        username,
        email,
        phone,
        position_id,
        branch_id,
        role_id,
        password,
        street,
        province,
        district,
        parish,
        postal_no,
        avatar,
        Fullname
      } = userData;

      console.log('Updating user with data:', userData);
      console.log('Parish value in updateById:', parish);

      const updates = [];
      const values = [];

      if (user_code !== undefined) {
        updates.push('user_code = ?');
        values.push(user_code);
      }
      if (username !== undefined) {
        updates.push('username = ?');
        values.push(username);
      }
      if (email !== undefined) {
        updates.push('email = ?');
        values.push(email);
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone);
      }
      if (position_id !== undefined) {
        updates.push('position_id = ?');
        values.push(position_id);
      }
      if (branch_id !== undefined) {
        updates.push('branch_id = ?');
        values.push(branch_id);
      }
      if (role_id !== undefined) {
        updates.push('role_id = ?');
        values.push(role_id);
      }
      if (password !== undefined) {
        updates.push('password = ?');
        values.push(password);
      }
      if (street !== undefined) {
        updates.push('street = ?');
        values.push(street);
      }
      if (province !== undefined) {
        updates.push('province = ?');
        values.push(province);
      }
      if (district !== undefined) {
        updates.push('district = ?');
        values.push(district);
      }
      if (parish !== undefined) {
        console.log('Adding parish to updates:', parish);
        updates.push('parish = ?');
        values.push(parish);
      }
      if (postal_no !== undefined) {
        updates.push('postal_no = ?');
        values.push(postal_no);
      }
      if (avatar !== undefined) {
        updates.push('avatar = ?');
        values.push(avatar);
      }
      if (Fullname !== undefined) {
        updates.push('Fullname = ?');
        values.push(Fullname);
      }

      if (updates.length === 0) {
        return { affectedRows: 0 };
      }

      values.push(id);
      const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
      console.log('Update query:', query);
      console.log('Update values:', values);

      const [result] = await db.query(query, values);
      return result;
    } catch (error) {
      console.error('Error in updateById:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);
      return result;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  },

  // Get users by role
  getUsersByRole: async (role) => {
    try {
      const [rows] = await db.query(
        'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.role_id = ?',
        [role]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

export default User;