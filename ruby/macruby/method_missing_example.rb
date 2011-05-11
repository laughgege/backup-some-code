framework 'AppKit'

class Greeter

  attr_reader :user

  def initialize(commands = {})
    voice_type = "com.apple.speech.synthesis.voice.Vicki"
    @voice     = NSSpeechSynthesizer.alloc.initWithVoice(voice_type)
    @user      = NSUserName()
    @commands  = {:hello => "Hello there #{user}, how are you today?",
                  :bye   => "Adios #{user}, come back soon!"}.merge(commands)
  end

  def method_missing(meth_symbol, *args, &block)
    command = @commands[meth_symbol]
    if command
      message = command.respond_to?(:call) ? command.call(self) : command
      @voice.startSpeakingString(message)
    end
  end

end