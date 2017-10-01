defmodule WebRtcWeb.PageControllerTest do
  use WebRtcWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Web RTC playground"
  end
end
