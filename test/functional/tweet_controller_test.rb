require 'test_helper'

class TweetControllerTest < ActionController::TestCase
  test "should get tweet" do
    get :tweet
    assert_response :success
  end

end
