import convoModel from "../models/conversation-model.js";



export const createConvo = async (req, res) => {
    console.log("request is comming")
    try {
        const { receiverId, userId: senderId } = req.body;
        // const senderId = req.user.id;

        if (senderId === receiverId) {
            return res.json({ message: "Cannot chat with yourself" });
        }

        // check if conversation already exists
        let conversation = await convoModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await convoModel.create({
                participants: [senderId, receiverId],
            });
        }

        res.json({success: true, conversation});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export const getAllConvo = async (req, res) => {

    const { userId: participants } = req.body;


    try {
        const conversations = await convoModel.find({
            participants
        })
            .populate("participants", "name email")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}