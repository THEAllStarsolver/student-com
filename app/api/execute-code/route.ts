import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();
    
    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }

    let result = '';
    
    if (language === 'javascript') {
      try {
        // Simple JavaScript execution with basic security
        const originalConsole = console.log;
        const logs: string[] = [];
        
        // Override console.log to capture output
        console.log = (...args: any[]) => {
          logs.push(args.map(arg => String(arg)).join(' '));
        };
        
        // Execute the code in a try-catch
        const func = new Function(code);
        const output = func();
        
        // Restore console.log
        console.log = originalConsole;
        
        // Combine logs and return value
        result = logs.length > 0 ? logs.join('\n') : String(output || 'Code executed successfully');
        
      } catch (error: any) {
        result = `Error: ${error.message}`;
      }
    } else {
      result = `Language ${language} is not supported yet. Only JavaScript is currently available.`;
    }

    return NextResponse.json({ 
      success: true, 
      output: result 
    });

  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}