# -*-coding:UTF-8-*-
import win32gui, win32con  
  
def wndProc(hwnd, msg, wParam, lParam):  
    if msg == win32con.WM_CREATE: print 'message: WM_CREATE'  
    if msg == win32con.WM_SIZE: print 'message: WM_SIZE'  
    if msg == win32con.WM_PAINT: print 'message: WM_PAINT'  
    if msg == win32con.WM_CLOSE:
        print 'message: WM_CLOSE'  
    if msg == win32con.WM_DESTROY:  
        print 'message: WM_DESTROY'  
        win32gui.PostQuitMessage(0)  
    return win32gui.DefWindowProc(hwnd, msg, wParam, lParam)  
         
wndClsStruct = win32gui.WNDCLASS()  
wndClsStruct.hbrBackground = win32con.COLOR_BTNFACE + 1  
wndClsStruct.hCursor = win32gui.LoadCursor(0, win32con.IDC_ARROW)  
wndClsStruct.hIcon = win32gui.LoadIcon(0, win32con.IDI_APPLICATION)  
wndClsStruct.lpszClassName = "MySimpleWindow"  
wndClsStruct.lpfnWndProc = wndProc
  
wndClassAtom = win32gui.RegisterClass(wndClsStruct)  
  
hwnd = win32gui.CreateWindow(  
            wndClassAtom, 'Test', win32con.WS_OVERLAPPEDWINDOW,  
            win32con.CW_USEDEFAULT, win32con.CW_USEDEFAULT,  
            win32con.CW_USEDEFAULT, win32con.CW_USEDEFAULT,  
            0,0, 0, None)  
  
win32gui.ShowWindow(hwnd, win32con.SW_SHOWNORMAL)  
win32gui.UpdateWindow(hwnd)  
win32gui.PumpMessages() 