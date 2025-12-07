// FILE: src/controllers/authController.js
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const config = require('../config/config'); 

class AuthController {
  register = async (req, res) => {
    try {
      const { username, email, password, no_handphone } = req.body;
      if (!username || !email || !password) return res.status(400).json({ message: 'Data tidak lengkap' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const profile_picture = `${username}.jpg`;

      const newUser = await userRepository.create({ 
        username, 
        email, 
        password: hashedPassword,
        no_handphone: no_handphone || null,
        profile_picture: profile_picture
      });
      
      const userResponse = { ...newUser };
      delete userResponse.password;

      res.status(201).json({ message: 'Registrasi berhasil', data: userResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findByEmail(email);
      if (!user) return res.status(401).json({ message: 'Email atau password salah' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Email atau password salah' });

      const payload = { 
            id: user.id, 
            email: user.email, 
            role: user.role || 'user' // Asumsi: Jika role kosong, default ke 'user'
        };

      const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });

      const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || 'user'
        };

      res.status(200).json({ message: 'Login berhasil', token: `Bearer ${token}`, data: userResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
}

// Ekspor INSTANCE (new)
module.exports = new AuthController();