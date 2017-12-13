class Message < ActiveRecord::Base

  def sender
    User.find(sender_id)
  end

  def receiver
    User.find(receiver_id)
  end
end
