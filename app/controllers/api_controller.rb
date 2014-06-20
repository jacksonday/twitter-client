class ApiController < ApplicationController

require 'twitter'

  def retrieveTweets
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = "mFGJ2AQ3d9fxWONHDtW08rVlM"
      config.consumer_secret     = "jf8l85Op16zlLkY2sAisA4FZVE8C4DSUFEwa8LX2ErkPkEmTIB"
      config.access_token        = "14145715-PAws3CQ6PwGkHgD83AgIqJf8V0BC6FvNCM6qet8W5"
      config.access_token_secret = "xe0xoAk4FFZ65VMH6Nl6MYoxzhWXOgcRZc18zdSoc9mJl"
    end

    if params[:max_id]
      tweets = client.search("Stanford", :result_type => "recent", :max_id => params[:max_id]).take(8)
    else
      tweets = client.search("Stanford", :result_type => "recent").take(8)
    end

    render :json => tweets, :status => 200
  end

  def postTweet
    if params.has_key?(:message) && params.has_key?(:username)
      message = { :message => "Your response has been successfully posted."}
      render :json => message, :status => 200
    else
      message = 'There was an error with your response.'
      render :json => {:error => message}.to_json, :status => 500
    end
  end

end
