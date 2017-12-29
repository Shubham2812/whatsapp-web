class Message < ActiveRecord::Base

  def sender
    User.find(self.sender_id)
  end

  def receiver
    User.find(self.receiver_id)
  end
end
