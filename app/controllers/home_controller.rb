class HomeController < ApplicationController
  before_action :authenticate_user!
  def index
    @messages = Message.all
    @online_users = User.where(status: 'online') - [current_user]
    @all_users = User.all - [current_user]

    @user = nil
    if params[:user_id]
      if params[:user_id] != '0'
        @user = User.find(params[:user_id])
        @messages = Message.where(sender_id: @user.id) + Message.where(receiver_id: @user.id)
        @messages.sort_by {|obj| obj.created_at}

        respond_to do |format|
          format.js{

          }
        end
      end
    end
  end

  def add_user
    @user = User.find_by_email(params[:email])
    if not @user
      return redirect_to root_path
    end
    respond_to do |format|
      format.js{

      }
    end
  end

  def create_message
    byebug
    sender_id = User.find_by_email(params[:sender_email]).id
    receiver_id = params[:receiver_id]
    message = Message.create(
        sender_id: sender_id,
        receiver_id: receiver_id,
        content: params[:message]
    )
    render json: message
  end

  def add_message
    byebug
    @message = Message.find(params[:message_id])
    @receiver_id = 0
    if params[:receiver_id]
      @receiver_id = params[:receiver_id].to_i
    end

    respond_to do |format|
      format.js{

      }
    end
  end

  def remove_user
    user = User.find_by_email(params[:email])
    if not user
      return redirect_to root_path
    end
    @user_id = user.id
    respond_to do |format|
      format.js{

      }
    end
  end
end
