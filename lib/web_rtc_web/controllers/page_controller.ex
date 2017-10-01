defmodule WebRtcWeb.PageController do
  use WebRtcWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
