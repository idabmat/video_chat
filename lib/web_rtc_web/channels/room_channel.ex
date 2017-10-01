defmodule WebRtcWeb.RoomChannel do
  use Phoenix.Channel
  require Logger

  def join("call", _, socket) do
    { :ok, socket }
  end

  def handle_in("message", %{"body" => body}, socket) do
    Logger.error("PAYLOAD: #{body}")
    broadcast! socket, "message", %{body: body}
    { :noreply, socket }
  end

  def handle_out("message", payload, socket) do
    push socket, "message", payload
    { :noreply, socket }
  end
end
