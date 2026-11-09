import { supabase } from "../lib/supabase.js";

const googleButton = document.querySelector("#google-login");
const status = document.querySelector("#login-status");

const authForms = document.querySelector("#auth-forms");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");

const signupEmail = document.querySelector("#signup-email");
const signupPassword = document.querySelector("#signup-password");
const signupPasswordConfirm = document.querySelector(
  "#signup-password-confirm",
);

const showSignupButton = document.querySelector("#show-signup");
const showLoginButton = document.querySelector("#show-login");
const forgotPasswordButton = document.querySelector("#forgot-password");

const accountInfo = document.querySelector("#account-info");
const userEmail = document.querySelector("#user-email");
const logoutButton = document.querySelector("#logout-button");

// ========================================
// 共通エラー出力
// ========================================

function logAuthError(context, error) {
  const details = {
    context,
    name: error?.name ?? "UnknownError",
    message: error?.message ?? String(error),
    status: error?.status ?? null,
    code: error?.code ?? null,
    timestamp: new Date().toISOString(),
  };

  console.groupCollapsed(
    `%c[AUTH ERROR] ${context}`,
    "color: #ff4d4f; font-weight: bold;",
  );

  console.error(details);

  console.groupEnd();
}

// ========================================
// 共通UI処理
// ========================================

function setStatus(text) {
  if (status) status.textContent = text;
}

function showLoggedOut() {
  authForms?.removeAttribute("hidden");
  accountInfo?.setAttribute("hidden", "");
}

function showLoggedIn(user) {
  authForms?.setAttribute("hidden", "");
  accountInfo?.removeAttribute("hidden");

  if (userEmail) {
    userEmail.textContent = user.email || "メールアドレス未登録";
  }

  setStatus("ログインしています。");
}

function setFormMode(mode) {
  if (!loginForm || !signupForm) return;

  loginForm.hidden = mode !== "login";
  signupForm.hidden = mode !== "signup";
  setStatus("");
}

// ========================================
// フォーム切り替え
// ========================================

showSignupButton?.addEventListener("click", () => {
  setFormMode("signup");
});

showLoginButton?.addEventListener("click", () => {
  setFormMode("login");
});

// ========================================
// Googleログイン
// ========================================

googleButton?.addEventListener("click", async () => {
  googleButton.disabled = true;
  setStatus("Googleログインへ移動しています...");

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://jaku.runs-at.dev/auth/callback",
      },
    });

    if (error) throw error;
  } catch (error) {
    logAuthError("Google Login", error);

    setStatus("Googleログインを開始できませんでした。");
    googleButton.disabled = false;
  }
});

// ========================================
// メールログイン
// ========================================

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const submitButton = loginForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  setStatus("ログインしています...");

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setStatus("ログインしました。");
  } catch (error) {
    logAuthError("Email Login", error);

    setStatus(
      "ログインできませんでした。メールアドレスとパスワードを確認してください。",
    );
  } finally {
    submitButton.disabled = false;
  }
});

// ========================================
// メール新規登録
// ========================================

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const passwordConfirm = signupPasswordConfirm.value;

  if (password.length < 8) {
    setStatus("パスワードは8文字以上で入力してください。");
    return;
  }

  if (password !== passwordConfirm) {
    setStatus("パスワードが一致しません。");
    return;
  }

  const submitButton = signupForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  setStatus("アカウントを登録しています...");

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://jaku.runs-at.dev/auth/callback",
      },
    });

    if (error) throw error;

    if (data.session) {
      setStatus("アカウントを登録しました。");
    } else {
      setStatus(
        "確認メールを送信しました。迷惑メールフォルダもご確認ください。メール内のリンクから登録を完了してください。",
      );
    }
  } catch (error) {
    logAuthError("Email Signup", error);

    setStatus(
      "登録できませんでした。入力内容やメールアドレスを確認してください。",
    );
  } finally {
    submitButton.disabled = false;
  }
});

// ========================================
// パスワード再設定
// ========================================

forgotPasswordButton?.addEventListener("click", async () => {
  const email = loginEmail.value.trim();

  if (!email) {
    setStatus("先にメールアドレスを入力してください。");
    loginEmail.focus();
    return;
  }

  forgotPasswordButton.disabled = true;
  setStatus("再設定メールを送信しています...");

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://jaku.runs-at.dev/auth/callback?type=recovery",
    });

    if (error) throw error;

    setStatus("パスワード再設定メールを送信しました。メールをご確認ください。");
  } catch (error) {
    logAuthError("Password Reset", error);

    setStatus("メールを送信できませんでした。入力内容を確認してください。");
  } finally {
    forgotPasswordButton.disabled = false;
  }
});

// ========================================
// ログアウト
// ========================================

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;
  setStatus("ログアウトしています...");

  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    showLoggedOut();
    setStatus("ログアウトしました。");
  } catch (error) {
    logAuthError("Logout", error);

    setStatus("ログアウトに失敗しました。");
  } finally {
    logoutButton.disabled = false;
  }
});

// ========================================
// 初期ログイン状態の確認
// ========================================

async function checkLogin() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (data.session?.user) {
      showLoggedIn(data.session.user);
    } else {
      showLoggedOut();
      setStatus("ログインしていません。");
    }
  } catch (error) {
    logAuthError("Session Check", error);

    setStatus("ログイン状態を確認できませんでした。");
  }
}

// ========================================
// ログイン状態の監視
// ========================================

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    showLoggedIn(session.user);
  } else {
    showLoggedOut();
  }
});

void checkLogin();
