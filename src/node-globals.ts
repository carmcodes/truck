import process from 'process/browser';
import { Buffer } from 'buffer';

(globalThis as any).process = process;
(globalThis as any).global = globalThis;
(globalThis as any).Buffer = Buffer;

// Some libs read process.env
(globalThis as any).process.env ||= {};
