#!/usr/bin/env ruby
file = ARGV[0]
content = File.read ARGV[0]

f = File.open(file, 'w+')
f.puts('-----BEGIN RSA PRIVATE KEY-----')
content.split(' ')[4..-5].each do |s|
  f.puts s
end
f.puts('-----END RSA PRIVATE KEY-----')
f.close