#!/usr/bin/env npx tsx
/**
 * Benchmark Runner
 * 
 * Run performance benchmarks.
 * 
 * Usage:
 *   npm run benchmark
 *   npx tsx scripts/benchmark.ts
 *   npx tsx scripts/benchmark.ts --suite search
 */

import { join } from 'path';
import { existsSync } from 'fs';

interface BenchmarkOptions {
  suite?: string;
  iterations?: number;
  verbose?: boolean;
}

function parseArgs(): BenchmarkOptions {
  const args = process.argv.slice(2);
  const options: BenchmarkOptions = {
    iterations: 100,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--suite' || args[i] === '-s') {
      options.suite = args[++i];
    } else if (args[i] === '--iterations' || args[i] === '-n') {
      options.iterations = parseInt(args[++i], 10);
    } else if (args[i] === '--verbose' || args[i] === '-v') {
      options.verbose = true;
    }
  }

  return options;
}

async function runBenchmark(name: string, fn: () => void, iterations: number) {
  const times: number[] = [];

  // Warmup
  for (let i = 0; i < 10; i++) {
    fn();
  }

  // Benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { name, avg, min, max, iterations };
}

async function main() {
  const options = parseArgs();
  const benchmarksDir = join(process.cwd(), 'benchmarks');

  console.log('\n⚡ claude-recall Benchmark Runner\n');
  console.log('═'.repeat(50));

  const suites = ['search', 'compression'];
  const suitesToRun = options.suite ? [options.suite] : suites;

  for (const suite of suitesToRun) {
    const benchFile = join(benchmarksDir, `${suite}.bench.ts`);
    
    if (!existsSync(benchFile)) {
      console.log(`\n⚠️  Benchmark suite not found: ${suite}`);
      continue;
    }

    console.log(`\n📊 Running ${suite} benchmarks...`);
    console.log('-'.repeat(40));

    // In a real implementation, this would dynamically import and run the benchmark
    console.log(`   Would run: ${benchFile}`);
    console.log(`   Iterations: ${options.iterations}`);
  }

  console.log('\n' + '═'.repeat(50));
  console.log('\nTo run actual benchmarks:');
  console.log('  npx tsx benchmarks/search.bench.ts');
  console.log('  npx tsx benchmarks/compression.bench.ts');
}

main().catch(console.error);
