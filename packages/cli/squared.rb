class Squared < Formula
  desc "CLI tool for managing Squared RPC services"
  homepage "https://github.com/yourusername/squared-cli"
  url "https://github.com/yourusername/squared-cli/archive/v0.1.0.tar.gz"
  sha256 "replace_with_actual_sha256_after_release"
  license "MIT"

  depends_on "go" => :build

  def install
    system "go", "build", *std_go_args(ldflags: "-s -w")
  end

  test do
    assert_match "Squared CLI for managing RPC services", shell_output("#{bin}/squared --help")
  end
end