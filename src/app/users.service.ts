import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  addUsers(user: any){
    return this.http.post(`${this.baseUrl}/users`, user)
  }

  getUsers(){
    return this.http.get(`${this.baseUrl}/users`)
  }

  updateUsers(id: any, user: any){
    return this.http.put(`${this.baseUrl}/users/${id}`, user)
  }

  deleteUser(id: any){
    return this.http.delete(`${this.baseUrl}/users/${id}`)
  }
}
