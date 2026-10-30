import { supabase } from "../lib/supabase.js";

const accountWrap = document.querySelector("#header-account-wrap");
const accountLink = document.querySelector("#header-account-link");
const accountMenu = document.querySelector("#header-account-menu");
const accountName = document.querySelector("#header-account-name");
const logoutButton = document.querySelector("#header-account-logout");

if (
  accountWrap instanceof HTMLElement &&
  accountLink instanceof HTMLAnchorElement &&
  accountMenu instanceof HTMLElement &&
  accountName instanceof HTMLElement &&
  logoutButton instanceof HTMLButtonElement
) {
  let currentUser = null;

  function getDisplayName(user) {
    const metadata = user?.user_metadata ?? {};

    return (
      metadata.display_name ??
      metadata.full_name ??
      metadata.name ??
      user?.email ??
      "ユーザー"
    );
  }

  function closeMenu() {
    accountMenu.hidden = true;
    accountLink.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    if (!currentUser) return;

    accountMenu.hidden = false;
    accountLink.setAttribute("aria-expanded", "true");
  }

  function toggleMenu() {
    if (!currentUser) return;

    if (accountMenu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  function updateAccountLink(user) {
    currentUser = user;

    if (!user) {
      accountLink.textContent = "ログイン";
      accountLink.href = "/login";
      accountLink.classList.remove("is-logged-in");
      accountLink.setAttribute("aria-label", "Googleログイン");
      accountLink.removeAttribute("title");
      accountLink.removeAttribute("aria-expanded");

      accountName.textContent = "ユーザー";
      closeMenu();
      return;
    }

    const metadata = user.user_metadata ?? {};
    const avatarUrl = metadata.avatar_url ?? metadata.picture;
    const username = getDisplayName(user);

    accountName.textContent = username;
    accountLink.href = "/login";
    accountLink.classList.add("is-logged-in");
    accountLink.setAttribute("aria-label", "アカウントメニュー");
    accountLink.setAttribute("aria-expanded", "false");
    accountLink.title = username;

    if (avatarUrl) {
      const avatar = document.createElement("img");

      avatar.className = "header-account-avatar";
      avatar.src = avatarUrl;
      avatar.alt = "";
      avatar.referrerPolicy = "no-referrer";

      avatar.onerror = () => {
        accountLink.classList.remove("is-logged-in");
        accountLink.textContent = "アカウント";
      };

      accountLink.replaceChildren(avatar);
    } else {
      accountLink.classList.remove("is-logged-in");
      accountLink.textContent = username;
    }
  }

  // PC：マウスを乗せると開く
  accountWrap.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      openMenu();
    }
  });

  accountWrap.addEventListener("mouseleave", () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      closeMenu();
    }
  });

  // クリック・タップで開閉
  accountLink.addEventListener("click", (event) => {
    if (!currentUser) return;

    event.preventDefault();
    toggleMenu();
  });

  // メニューの外側をクリックすると閉じる
  document.addEventListener("click", (event) => {
    if (!accountWrap.contains(event.target)) {
      closeMenu();
    }
  });

  // Escapeキーで閉じる
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !accountMenu.hidden) {
      closeMenu();
      accountLink.focus();
    }
  });

  // ログアウト
  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    logoutButton.textContent = "ログアウト中...";

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      closeMenu();
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
      alert("ログアウトに失敗しました。もう一度お試しください。");
    } finally {
      logoutButton.disabled = false;
      logoutButton.textContent = "ログアウト";
    }
  });

  // ログイン状態・プロフィール更新を反映
  supabase.auth.onAuthStateChange((_event, session) => {
    updateAccountLink(session?.user ?? null);
  });

  async function initialize() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("ログイン状態の取得に失敗しました:", error);
      return;
    }

    updateAccountLink(data.session?.user ?? null);
  }

  void initialize();
}
