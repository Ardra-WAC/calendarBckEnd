// import express from 'express';
// import Event from '../models/Event.js';

// const router = express.Router();

// // Middleware to get user from headers
// const getUser = (req, res, next) => {
//   const roleValue = req.headers['role-value'];
//   const userEmail = req.headers['user-email'];
//   if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });
//   req.user = { email: userEmail, role: roleValue };
//   next();
// };

// // Create a new event
// router.post('/', getUser, async (req, res) => {
//   const { projectName, meetingDate, startTime, endTime, meetingRoom } = req.body;
//   try {
//     const event = new Event({
//       projectName,
//       createdBy: req.user.email,
//       meetingDate,
//       startTime,
//       endTime,
//       meetingRoom,
//     });
//     await event.save();
//     res.status(201).json(event);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all events
// router.get('/', async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update an event
// router.put('/:id', getUser, async (req, res) => {
//   const { id } = req.params;
//   const { projectName, meetingDate, startTime, endTime, meetingRoom } = req.body;
//   try {
//     const event = await Event.findById(id);
//     if (!event) return res.status(404).json({ message: 'Event not found' });
//     if (event.createdBy !== req.user.email) {
//       return res.status(403).json({ message: 'Unauthorized to edit this event' });
//     }
//     event.projectName = projectName;
//     event.meetingDate = meetingDate;
//     event.startTime = startTime;
//     event.endTime = endTime;
//     event.meetingRoom = meetingRoom;
//     await event.save();
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Delete an event
// // router.delete('/:id', getUser, async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     const event = await Event.findById(id);
// //     if (!event) return res.status(404).json({ message: 'Event not found' });
// //     if (event.createdBy !== req.user.email) {
// //       return res.status(403).json({ message: 'Unauthorized to delete this event' });
// //     }
// //     await event.remove();
// //     res.json({ message: 'Event deleted' });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// router.delete('/:id', getUser, async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }
//     await event.deleteOne(); 
//     res.status(204).send(); 
//   } catch (error) {
//     console.error("Delete error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;


const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  const { projectName, meetingDate, startTime, endTime, meetingRoom } = req.body;
  const email = req.headers['user-email'];
  const role = req.headers['role-value'];

  if (!email || !['Project Coordinator', 'Team Lead'].includes(role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const event = new Event({
    projectName,
    meetingDate,
    startTime,
    endTime,
    meetingRoom,
    createdBy: email
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  const email = req.headers['user-email'];
  const role = req.headers['role-value'];

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy !== email || !['Project Coordinator', 'Team Lead'].includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  const email = req.headers['user-email'];
  const role = req.headers['role-value'];

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy !== email || !['Project Coordinator', 'Team Lead'].includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;