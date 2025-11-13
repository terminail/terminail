#!/usr/bin/env python3
"""
Test runner script for Terminail MCP Server
"""
import subprocess
import sys
import os
from pathlib import Path


def run_command(cmd, description):
    """Run a command and handle output"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(cmd)}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        
        if result.returncode != 0:
            print(f"❌ {description} failed with exit code {result.returncode}")
            return False
        else:
            print(f"✅ {description} completed successfully")
            return True
    except Exception as e:
        print(f"❌ Error running {description}: {e}")
        return False


def install_test_dependencies():
    """Install test dependencies"""
    requirements_file = Path(__file__).parent / "requirements-test.txt"
    if requirements_file.exists():
        return run_command(
            [sys.executable, "-m", "pip", "install", "-r", str(requirements_file)],
            "Installing test dependencies"
        )
    else:
        print("⚠️  Test requirements file not found, skipping dependency installation")
        return True


def run_unit_tests():
    """Run unit tests"""
    return run_command(
        [sys.executable, "-m", "pytest", "tests/unit/", "-v", "-m", "unit"],
        "Unit tests"
    )


def run_integration_tests():
    """Run integration tests"""
    return run_command(
        [sys.executable, "-m", "pytest", "tests/integration/", "-v", "-m", "integration"],
        "Integration tests"
    )


def run_e2e_tests():
    """Run end-to-end tests"""
    return run_command(
        [sys.executable, "-m", "pytest", "tests/e2e/", "-v", "-m", "e2e"],
        "End-to-end tests"
    )


def run_all_tests():
    """Run all tests"""
    return run_command(
        [sys.executable, "-m", "pytest", "tests/", "-v"],
        "All tests"
    )


def run_tests_with_coverage():
    """Run tests with coverage report"""
    return run_command(
        [sys.executable, "-m", "pytest", "tests/", "-v", "--cov=mcp_server", "--cov-report=html", "--cov-report=term"],
        "Tests with coverage"
    )


def main():
    """Main test runner function"""
    print("🚀 Terminail MCP Server Test Runner")
    print("=" * 60)
    
    # Change to project root directory
    project_root = Path(__file__).parent.parent
    os.chdir(project_root)
    print(f"Working directory: {os.getcwd()}")
    
    # Parse command line arguments
    args = sys.argv[1:]
    
    if not args:
        # Default: run all tests
        args = ["all"]
    
    # Install dependencies first
    if not install_test_dependencies():
        print("❌ Failed to install test dependencies")
        sys.exit(1)
    
    success = True
    
    for arg in args:
        if arg == "unit":
            success = run_unit_tests() and success
        elif arg == "integration":
            success = run_integration_tests() and success
        elif arg == "e2e":
            success = run_e2e_tests() and success
        elif arg == "all":
            success = run_all_tests() and success
        elif arg == "coverage":
            success = run_tests_with_coverage() and success
        elif arg == "help" or arg == "-h" or arg == "--help":
            print("\nUsage: python run_tests.py [unit|integration|e2e|all|coverage|help]")
            print("\nOptions:")
            print("  unit        Run only unit tests")
            print("  integration Run only integration tests")
            print("  e2e         Run only end-to-end tests")
            print("  all         Run all tests (default)")
            print("  coverage    Run tests with coverage report")
            print("  help        Show this help message")
            return
        else:
            print(f"❌ Unknown argument: {arg}")
            print("Use 'help' for usage information")
            sys.exit(1)
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 All tests completed successfully!")
        sys.exit(0)
    else:
        print("❌ Some tests failed")
        sys.exit(1)


if __name__ == "__main__":
    main()