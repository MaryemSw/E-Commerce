const Contact = require("../models/contact");

class ContactController {
  async submitContact(req, res) {
    try {
      const { name, email, subject, message } = req.body;

      const contact = new Contact({
        name,
        email,
        subject,
        message,
      });

      await contact.save();
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to send message" });
    }
  }

  async getAllContacts(req, res) {
    try {
      const contacts = await Contact.find({}).sort({ createdAt: -1 });
      res.json({ contacts });
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch contacts" });
    }
  }

  async updateContactStatus(req, res) {
    try {
      const { status } = req.body;
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      res.json({ message: "Contact status updated", contact });
    } catch (error) {
      res.status(400).json({ error: "Failed to update contact" });
    }
  }

  async deleteContact(req, res) {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete contact" });
    }
  }
}

module.exports = new ContactController();