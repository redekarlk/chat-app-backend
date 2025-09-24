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

        res.json({ success: true, conversation });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }

}


export const getAllConvo = async (req, res) => {

    const { userId: participants } = req.body;

    // console.log("convo called!!")


    try {
        const conversations = await convoModel.find({
            participants
        })
            .populate("participants", "name email")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.json({ success: true, conversations });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}