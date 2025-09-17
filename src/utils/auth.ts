import { apiFetch, setToken } from "./api";
import { queryClient } from "@/routes/__root";
import { init, retrieveRawInitData } from "@telegram-apps/sdk";

const rejectRefetchOnAuth = ["auth", "interests", "cities", "posts-feed"];

let reauthAttempt = 0;
async function reauth() {
  let initData = null;

  if (reauthAttempt == 0) {
    reauthAttempt++;
    initData = decodeURIComponent(
      location.hash.split("#tgWebAppData=").slice(1)[0].split("&")[0]
    );
  } else {
    init();
    initData = retrieveRawInitData();
  }
  const response = await apiFetch(`/tg/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData })
  });
  const data = await response.json();
  if (data?.accessToken) setToken(data.accessToken);
  return data;
}

let isAttemptingTokenRefresh = false;
export async function refreshToken() {
  if (isAttemptingTokenRefresh) return;
  isAttemptingTokenRefresh = true;
  try {
    const response = await apiFetch(`/profile`);
    if (response.status === 401) {
      await reauth();
    }
    isAttemptingTokenRefresh = false;

    // Invalidate every query in the cache, refetch them
    queryClient.refetchQueries({
      predicate: (query) =>
        !rejectRefetchOnAuth.includes(query.queryKey[0] as string),
    });
    // just invalidate the feed
    queryClient.invalidateQueries({
      queryKey: ["posts-feed"],
    });

    return;
  } catch (e) {
    console.log(e);
  }

  // refresh went wrong, reload the page
  // if (isAttemptingTokenRefresh) {
  //   window.location.reload();
  // }
}
