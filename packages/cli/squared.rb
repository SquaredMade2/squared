class Squared < Formula
  desc "Squared CLI for managing RPC services"
  homepage "https://github.com/SquaredMade2/squared"
  url "https://github.com/SquaredMade2/squared/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "replace_with_actual_sha256"
  license "MIT"

  depends_on "go" => :build

  def install
    cd "packages/cli" do
      system "go", "build", "-o", bin/"squared", "."
    end
  end

  test do
    assert_match "Squared CLI for managing RPC services", shell_output("#{bin}/squared --help")
  end
end