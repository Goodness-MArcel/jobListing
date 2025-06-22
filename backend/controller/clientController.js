import Client from "../models/User.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profiles/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.trim());
};

const validateWebsite = (website) => {
  if (!website) return true; // Website is optional
  const websiteRegex = /^https?:\/\/.+/;
  return websiteRegex.test(website);
};

// Get client profile
export const getClientProfile = async (req, res) => {
  try {
    const clientId = req.query.client_id || req.params.client_id;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required."
      });
    }

    const client = await Client.findByPk(clientId, {
      attributes: { exclude: ['password'] }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found."
      });
    }

    // Format the response data - handle both name formats
    const firstName = client.firstName || '';
    const lastName = client.lastName || '';
    const fullName = client.name || `${firstName} ${lastName}`.trim();

    const clientData = {
      id: client.id,
      firstName: firstName,
      lastName: lastName,
      name: fullName,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      location: client.location || '',
      bio: client.bio || '',
      website: client.website || '',
      profileImageUrl: client.profileImage ? 
        `${req.protocol}://${req.get('host')}/uploads/profiles/${client.profileImage}` : null,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };

    res.status(200).json({
      success: true,
      message: "Client profile retrieved successfully",
      data: clientData
    });

  } catch (error) {
    console.error("Error fetching client profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Update client profile
export const updateClientProfile = async (req, res) => {
  try {
    const clientId = req.query.client_id || req.params.client_id;
    
    console.log('=== UPDATE PROFILE REQUEST ===');
    console.log('Client ID:', clientId);
    console.log('Body:', req.body);
    console.log('File:', req.file ? {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : 'No file uploaded');
    console.log('================================');
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required."
      });
    }

    // Extract and validate required fields
    let { name, email } = req.body;
    let firstName, lastName;

    // If name exists, split it into first and last names
    if (name && typeof name === 'string') {
      const nameParts = name.trim().split(/\s+/); // Split by any whitespace
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    } else {
      // Fallback to separate firstName/lastName if provided
      firstName = req.body.firstName || '';
      lastName = req.body.lastName || '';
    }

    console.log('Extracted fields:', { firstName, lastName, email });
    
    // Rest of your validation and processing...
    if (!firstName || !firstName.trim()) {
      console.log('❌ First name validation failed:', firstName);
      return res.status(400).json({
        success: false,
        message: "First name is required.",
        field: "firstName"
      });
    }

    if (!lastName || !lastName.trim()) {
      console.log('❌ Last name validation failed:', lastName);
      return res.status(400).json({
        success: false,
        message: "Last name is required.",
        field: "lastName"
      });
    }

    if (!email || !email.trim()) {
      console.log('❌ Email validation failed:', email);
      return res.status(400).json({
        success: false,
        message: "Email is required.",
        field: "email"
      });
    }

    // Validate email format
    if (!validateEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
        field: "email"
      });
    }

    // Validate phone if provided
    if (req.body.phone && !validatePhone(req.body.phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number.",
        field: "phone"
      });
    }

    // Validate website if provided
    if (req.body.website && !validateWebsite(req.body.website)) {
      return res.status(400).json({
        success: false,
        message: "Website must start with http:// or https://",
        field: "website"
      });
    }

    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found."
      });
    }

    // Check if email is already taken by another user
    if (email.trim().toLowerCase() !== client.email?.toLowerCase()) {
      const existingClient = await Client.findOne({
        where: { 
          email: email.trim().toLowerCase(),
          id: { [Client.sequelize.Sequelize.Op.ne]: clientId }
        }
      });

      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered with another account.",
          field: "email"
        });
      }
    }

    // Prepare update data
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: email.trim().toLowerCase(),
      phone: req.body.phone ? req.body.phone.trim() : null,
      company: req.body.company ? req.body.company.trim() : null,
      location: req.body.location ? req.body.location.trim() : null,
      bio: req.body.bio ? req.body.bio.trim() : null,
      website: req.body.website ? req.body.website.trim() : null,
    };

    // Handle profile image upload
    if (req.file) {
      console.log('Processing new profile image:', req.file.filename);
      
      // Delete old profile image if exists
      if (client.profileImage) {
        const oldImagePath = path.join('uploads/profiles/', client.profileImage);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Old profile image deleted:', oldImagePath);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError);
          }
        }
      }
      updateData.profileImageUrl = req.file.filename;
    } else {
      console.log('No new image uploaded, keeping existing image');
    }

    console.log('Final update data:', updateData);

    // Update client
    await client.update(updateData);
    await client.reload();

    console.log('✅ Client updated successfully');

    // Format response data
    const responseData = {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      location: client.location || '',
      bio: client.bio || '',
      website: client.website || '',
      profileImageUrl: client.profileImage ? 
       `${req.protocol}://${req.get('host')}/uploads/profiles/${client.profileImage}` : null,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: responseData
    });

  } catch (error) {
    console.error("❌ Error updating client profile:", error);
    
    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 5MB.",
          field: "profileImage"
        });
      }
      return res.status(400).json({
        success: false,
        message: "File upload error: " + error.message,
        field: "profileImage"
      });
    }

    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Email is already registered with another account.",
        field: "email"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Middleware for handling file upload
export const uploadProfileImage = upload.single('profileImage');

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
  console.error('Multer error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB.",
        field: "profileImage"
      });
    }
    return res.status(400).json({
      success: false,
      message: "File upload error: " + error.message,
      field: "profileImage"
    });
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed.",
      field: "profileImage"
    });
  }
  
  next(error);
};