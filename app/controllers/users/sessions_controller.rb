class Users::SessionsController < Devise::SessionsController

  # before_action :change_status, only: :destroy
  #
  # def change_status
  #   current_user.status = 'offline'
  #   current_user.save
  # end

  def create
    super
    current_user.status = 'online'
    current_user.save
  end

  def destroy
    current_user.status = 'offline'
    current_user.save
    super
  end
end