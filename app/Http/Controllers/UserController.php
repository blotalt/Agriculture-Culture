<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserController extends Controller
{
   public function register(Request $request)
{
    $incomingFields = $request->validate([
        'name' => ['required', 'min:3', 'max:10', Rule::unique('users', 'name')],
        'email' => ['required', 'email', Rule::unique('users', 'email')],
        'password' => ['required', 'confirmed', 'min:3', 'max:200']
    ]);

    $incomingFields['password'] = bcrypt($incomingFields['password']);
    $user = User::create($incomingFields);

    auth()->login($user);

    return redirect('/dashboard');
}

public function login(Request $request)
{
    $incomingFields = $request->validate([
        'loginname' => 'required',
        'loginpassword' => 'required'
    ]);

    if (auth()->attempt([
        'name' => $incomingFields['loginname'],
        'password' => $incomingFields['loginpassword']
    ])) {
        $request->session()->regenerate();
        return redirect('/dashboard');
    }

    return back()->withErrors([
        'loginname' => 'Invalid username or password',
    ]);
}
    public function logout(Request $request){
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
