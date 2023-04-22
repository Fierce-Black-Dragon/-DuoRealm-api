import mongoose, { Schema, Document, InferSchemaType } from "mongoose";

const chatSchema = new Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }],
      is_blocked:{
        type: Boolean,
        default:false
      },
      is_mutted:{
        type: Boolean,
        default:false
      },
      is_pinned:{
        type: Boolean,
        default:false
      },
      is_archived:{
        type: Boolean,
        default:false
      }
     
},{
    timestamps: true
  });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat