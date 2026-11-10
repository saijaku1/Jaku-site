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
// ローディング処理
// ========================================

const authLoading = document.querySelector("#auth-loading");
const authLoadingMessage = document.querySelector("#auth-loading-message");

function showAuthLoading(message = "処理しています...") {
  if (!authLoading) return;

  if (authLoadingMessage) {
    authLoadingMessage.textContent = message;
  }

  authLoading.hidden = false;
}

function hideAuthLoading() {
  if (!authLoading) return;

  authLoading.hidden = true;
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

  showAuthLoading("Googleアカウントを確認しています...");

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://jaku.runs-at.dev/auth/callback",
      },
    });

    if (error) throw error;

    // 成功時はGoogle認証画面へ移動するため、
    // ローディングを維持する。
  } catch (error) {
    hideAuthLoading();

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

  showAuthLoading("ログインしています...");

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

    hideAuthLoading();
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

  showAuthLoading("アカウントを作成しています...");

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

    hideAuthLoading();
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

  showAuthLoading("再設定メールを送信しています...");

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

    hideAuthLoading();
  }
});

// ========================================
// ログアウト
// ========================================

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;

  setStatus("ログアウトしています...");

  showAuthLoading("ログアウトしています...");

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

    hideAuthLoading();
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

// ========================================
// 認証エラー管理
// ========================================

const authErrorElement = document.querySelector("#auth-error-details");
const authErrorTitle = document.querySelector("#auth-error-title");
const authErrorReason = document.querySelector("#auth-error-reason");
const authErrorCode = document.querySelector("#auth-error-code");
const authErrorId = document.querySelector("#auth-error-id");
const authErrorTime = document.querySelector("#auth-error-time");

// Supabaseのエラーコードを独自コードに変換
const AUTH_ERRORS = {
  invalid_credentials: {
    code: "AUTH-001",
    title: "ログインに失敗しました",
    reason: "メールアドレスまたはパスワードが正しくありません。",
  },

  email_not_confirmed: {
    code: "AUTH-002",
    title: "メールアドレスが未確認です",
    reason: "確認メール内のリンクからメールアドレスの認証を完了してください。",
  },

  user_already_exists: {
    code: "AUTH-003",
    title: "アカウントを登録できません",
    reason:
      "このメールアドレスでは登録を完了できません。ログインやパスワード再設定もお試しください。",
  },

  email_exists: {
    code: "AUTH-003",
    title: "アカウントを登録できません",
    reason:
      "このメールアドレスでは登録を完了できません。ログインやパスワード再設定もお試しください。",
  },

  weak_password: {
    code: "AUTH-004",
    title: "パスワードが弱すぎます",
    reason: "別のパスワードを設定してください。",
  },

  over_email_send_rate_limit: {
    code: "AUTH-005",
    title: "メール送信回数の上限です",
    reason:
      "短時間にメールを送りすぎています。時間をおいてから再度お試しください。",
  },

  email_address_invalid: {
    code: "AUTH-006",
    title: "メールアドレスが正しくありません",
    reason: "有効なメールアドレスを入力してください。",
  },

  signup_disabled: {
    code: "AUTH-007",
    title: "新規登録を利用できません",
    reason: "現在、新規アカウント登録が無効になっています。",
  },

  otp_expired: {
    code: "AUTH-008",
    title: "認証リンクの有効期限が切れています",
    reason: "新しい確認メールを送信して、もう一度お試しください。",
  },

  session_not_found: {
    code: "AUTH-009",
    title: "ログイン状態を確認できません",
    reason: "もう一度ログインしてください。",
  },

  refresh_token_not_found: {
    code: "AUTH-010",
    title: "ログイン情報を更新できません",
    reason: "もう一度ログインしてください。",
  },

  provider_disabled: {
    code: "AUTH-011",
    title: "Googleログインを利用できません",
    reason: "現在、このログイン方法が無効になっています。",
  },
};

// ========================================
// エラーID生成
// ========================================

function createAuthErrorId() {
  const bytes = new Uint8Array(4);

  crypto.getRandomValues(bytes);

  const id = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return `ERR-${id}`;
}

// ========================================
// エラー表示を消す
// ========================================

function clearAuthError() {
  if (authErrorElement) {
    authErrorElement.hidden = true;
  }
}

// ========================================
// エラーを画面とコンソールに出力
// ========================================

function logAuthError(context, error) {
  const supabaseCode = error?.code;
  const errorMessage = error?.message ?? String(error);

  let errorInfo = AUTH_ERRORS[supabaseCode];

  // ネットワークエラーの判定
  if (
    !errorInfo &&
    /fetch failed|failed to fetch|networkerror|network request failed/i.test(
      errorMessage,
    )
  ) {
    errorInfo = {
      code: "AUTH-998",
      title: "通信に失敗しました",
      reason: "ネットワーク接続を確認して、もう一度お試しください。",
    };
  }

  // 未登録のエラー
  if (!errorInfo) {
    errorInfo = {
      code: "AUTH-999",
      title: "予期しないエラーが発生しました",
      reason:
        "時間をおいて再度お試しください。解決しない場合はお問い合わせください。",
    };
  }

  const errorId = createAuthErrorId();
  const occurredAt = new Date();

  // HTMLに表示
  if (
    authErrorElement &&
    authErrorTitle &&
    authErrorReason &&
    authErrorCode &&
    authErrorId &&
    authErrorTime
  ) {
    authErrorTitle.textContent = errorInfo.title;
    authErrorReason.textContent = errorInfo.reason;
    authErrorCode.textContent = errorInfo.code;
    authErrorId.textContent = errorId;
    authErrorTime.textContent = occurredAt.toLocaleString("ja-JP");

    authErrorElement.hidden = false;
  }

  // 開発者向けログ
  console.groupCollapsed(`[AUTH ERROR] ${errorInfo.code} / ${errorId}`);

  console.error({
    context,
    customCode: errorInfo.code,
    errorId,
    supabaseCode: supabaseCode ?? null,
    name: error?.name ?? null,
    message: errorMessage,
    status: error?.status ?? null,
    timestamp: occurredAt.toISOString(),
  });

  console.groupEnd();
}
