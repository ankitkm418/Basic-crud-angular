import { Component, OnInit, PipeTransform } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users.service';

interface Users {
  name: string;
  status: string;
}


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  users: Users[] = [];
  filter = new FormControl('', { nonNullable: true });
  closeResult!: string;
  status = ['Active', 'Inactive'];
  tasksForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    status: new FormControl('')
  });
  submitted: boolean = false;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private usersService: UsersService) {}

  ngOnInit() {
    this.tasksForm = this.formBuilder.group({
      name: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      status: ['Active', [Validators.required]],
    });
    this.getUsers();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.tasksForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.tasksForm.invalid) {
      return;
    }
    this.usersService.addUsers(this.tasksForm.value).subscribe(res => {
      this.getUsers();
      this.modalService.dismissAll();
    })
  }

  onReset(): void {
    this.submitted = false;
    this.tasksForm.reset();
  }

  getUsers() {
    this.usersService.getUsers().subscribe((res: any) => {
      this.users = res;
    })
  }

  updateUser(user:any){
    console.log(user, user.status)
    const userStatus = {
      ...user,
      status: user.status === 'Active' ? 'Inactive': 'Active'
    }
    this.usersService.updateUsers(user.id, userStatus).subscribe(res=>{
      this.getUsers()
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

  onKeyPress(evt: any){
    const evtVal = (evt.target.value).toLocaleLowerCase();
    if(evtVal == ''){
      this.getUsers();
    }
    const filteredArr = this.users.filter(el =>{
      const lowerCaseName = el.name.toLocaleLowerCase();
      return lowerCaseName.includes(evtVal);
    });

    this.users = filteredArr;
  }

  onStatusChangeFilter(evt:any){
    const status = evt.target.value
    const filteredArr = this.users.filter(el =>el.status.includes(status));
    this.users = filteredArr;

    
  }
}