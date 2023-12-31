const User = require("../Models/user");
const { userTypes, userStatus } = require("../utils/constants");
const Ticket = require("../Models/ticket");

exports.createTicket = async (req, res) => {
  const ticketObj = {
    title: req.body.title,
    ticketPriority: req.body.ticketPriority,
    description: req.body.description,
    status: req.body.status,
    requestor: req.username,
  };

  try {
    const ticket = await Ticket.create(ticketObj);

    return res.status(201).send(ticket);
  } catch (e) {
    return res.status(500).send({ message: "Internal Server Error! (Cont)" });
  }
};
exports.geAllTickets = async (req, res) => {
  const username = req.username;

  const savedUser = await User.findOne({ username: username });
  const userType = savedUser.userTypes;

  var queryObject = {};

  if (userType == userTypes.customer) {
    queryObject = { requestor: username };
  } else if (userType == userTypes.engineer) {
    queryObject = { $or: [{ assignee: username }, { requestor: username }] };
  }

  const tickets = await Ticket.find(queryObject);
  return res.status(200).send(tickets);
};

exports.getTicketById = async (req, res) => {
  const username = req.username;

  const savedUser = await User.findOne({ username: username });
  const userType = savedUser.userTypes;

  var queryObject = { id: req.params.id };
  const savedTicket = await Ticket.findOne(queryObject);

  if (userType == userTypes.admin) {
    return res.status(200).send(savedTicket);
  }

  if (savedTicket.requestor === username || savedTicket.assignee === username) {
    return res.status(200).send(savedTicket);
  }

  return res.status(403).send({
    message: "The user has insufiicient permissions to access this ticket",
  });
};

exports.updateTicketById = async (req, res) => {
  const ticketId = req.params.id;
  const username = req.username;

  const savedTicket = await Ticket.findOne({ _id: ticketId });
  const savedUser = await User.findOne({ username: username });

  if (
    savedUser.userTypes == userTypes.admin ||
    savedTicket.requestor == username ||
    savedTicket.assignee == username
  ) {
    savedTicket.title = req.body.title ? req.body.title : savedTicket.title;
    savedTicket.description = req.body.description
      ? req.body.description
      : savedTicket.description;
    savedTicket.ticketPriority = req.body.ticketPriority
      ? req.body.ticketPriority
      : savedTicket.ticketPriority;
    savedTicket.status = req.body.status ? req.body.status : savedTicket.status;
    savedTicket.assignee = req.body.assignee
      ? req.body.assignee
      : savedTicket.assignee;

    var updatedTicket = await savedTicket.save();

    return res.status(200).send(updatedTicket);
  }

  return res.status(403).send({
    message: "The user has insufiicient permissions to update this ticket",
  });
};
