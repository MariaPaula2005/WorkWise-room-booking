const Booking = require('../models/booking');

// Controller function to create a new booking and check for overlap
const createBooking = async (req, res) => {
    try {
        const { startDate, endDate, startTime, endTime, workspaceTitle } = req.body;

        console.log('Checking for overlap...');
        // Check for overlap
        const overlap = await Booking.checkOverlap(startDate, endDate, startTime, endTime, workspaceTitle);
        console.log('Overlap:', overlap);

        if (overlap) {
            return res.status(400).json({ message: 'Booking overlaps with existing booking' });
        }

        // Create a new booking document
        const booking = new Booking({
            workspaceTitle,
            startDate,
            endDate,
            startTime,
            endTime
        });

        // Save the booking document to the database
        await booking.save();

        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

module.exports = { createBooking };
