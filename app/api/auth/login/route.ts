// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

type DemoUser = {
  id: string;
  username: string;
  password: string;
  role: string;
  companyId: string;
};

const DEMO_USERS: Record<string, DemoUser> = {
  admin: {
    id: "demo-admin",
    username: "admin",
    password: "admin12345",
    role: "SUPER_ADMIN",
    companyId: "all",
  },
  acme: {
    id: "demo-acme",
    username: "acme",
    password: "acme12345",
    role: "COMPLIANCE_MANAGER",
    companyId: "acme-srl",
  },
  beta: {
    id: "demo-beta",
    username: "beta",
    password: "beta12345",
    role: "CLIENT_ADMIN",
    companyId: "beta-logistics",
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body?.username ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    const demoUser = DEMO_USERS[username];

    if (!demoUser || demoUser.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    await createSession({
      id: demoUser.id,
      username: demoUser.username,
      role: demoUser.role,
      companyId: demoUser.companyId,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: demoUser.id,
        username: demoUser.username,
        role: demoUser.role,
        companyId: demoUser.companyId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
