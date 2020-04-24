import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core'
import { merge, of as observableOf, Subscription } from 'rxjs'
import { map, switchMap, startWith, catchError } from 'rxjs/operators'
import { Bank } from 'src/app/shared/models/bank'
import { BankService } from 'src/app/shared/services/bank.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { FormBuilder, Validators } from '@angular/forms'
import { Product } from 'src/app/shared/models/product'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.sass'],
})
export class BankComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['lastUpdated', 'name', 'code', 'product', 'action']
  productColumns: string[] = ['id', 'name', 'content']
  productData: Product[] = [
    { name: 'VIP card', content: { name: '', content: '', tag: '' }, tag: '' },
    { name: 'Platium card', content: { name: '', content: '', tag: '' }, tag: '' },
    { name: 'Visa card', content: { name: '', content: '', tag: '' }, tag: '' },
    { name: 'Birthday gift', content: { name: '', content: '', tag: '' }, tag: '' },
    { name: 'Travel', content: { name: '', content: '', tag: '' }, tag: '' },
    { name: 'Study aboard', content: { name: '', content: '', tag: '' }, tag: '' },
  ]
  data: Bank[] = []
  observers: Subscription[] = []

  resultsLength = 0
  isLoadingResults = true
  isRateLimitReached = false
  selectedBank = undefined
  editMode = false

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  @ViewChild(MatSort, { static: false }) sort: MatSort
  @ViewChild('code', { static: false }) code: ElementRef
  @ViewChild('name', { static: false }) name: ElementRef
  constructor(private bankService: BankService, private _snackbar: MatSnackBar) {}
  ngOnDestroy() {
    this.observers.forEach((obs) => obs.unsubscribe())
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true
          return this.bankService!.getAll(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex
          )
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false
          this.isRateLimitReached = false
          this.resultsLength = data.total_count

          return data.items
        }),
        catchError(() => {
          this.isLoadingResults = false
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true
          return observableOf([])
        })
      )
      .subscribe((data) => (this.data = data))
  }

  selected(id) {
    return this.selectedBank && this.selectedBank._id === id
  }

  contentToString(content) {
    return JSON.stringify(content)
  }

  ngOnInit() {}

  format(date) {
    return date.split('T')[0]
  }

  nameExist(name) {
    return this.data.findIndex((e) => e.name.toLowerCase() === name.toLowerCase()) >= 0
  }

  codeExist(code) {
    return this.data.findIndex((e) => e.code.toLowerCase() === code.toLowerCase()) >= 0
  }

  save(id) {
    const name = this.name.nativeElement.value
    const code = this.code.nativeElement.value
    // unchanged
    if (this.selectedBank.name === name && this.selectedBank.code === code) {
      this.selectedBank = undefined
      this.editMode = !this.editMode
      return
    }
    // empty
    if (!code || !name) {
      this._snackbar.open('Invalid name or code', 'Ok', { duration: 4500 })
      return
    } else if (this.selectedBank.name !== name && this.nameExist(name)) {
      this._snackbar.open(`Name ${name} have already existed`, 'Ok', { duration: 4500 })
      return
    } else if (this.selectedBank.code !== code && this.codeExist(code)) {
      this._snackbar.open(`Code ${code} have already existed`, 'Ok', { duration: 4500 })
      return
    }
    const bank = this.data.find((e) => e._id === id)
    bank.code = code
    bank.name = name
    this.observers.push(
      this.bankService.put(id, bank).subscribe((res) => {
        this.observers.push(
          this.bankService
            .getAll(this.sort.active, this.sort.direction, this.paginator.pageIndex)
            .subscribe((res) => {
              this.data = res.items
              this.resultsLength = res.total_count
            })
        )
        this._snackbar.open('Bank updated', 'Ok', { duration: 2500 })
        this.selectedBank = undefined
        this.editMode = !this.editMode
      })
    )
  }
  cancel() {
    this.editMode = !this.editMode
    this.selectedBank = undefined
  }

  edit(id) {
    if (!this.editMode) {
      this.selectedBank = this.data.find((e) => e._id === id)
    } else {
      this.selectedBank = undefined
    }
    this.editMode = !this.editMode
  }

  delete(id) {
    this.observers.push(
      this.bankService.delete(id).subscribe((res) => {
        this._snackbar.open('Bank deleted', 'Ok', { duration: 2500 })
        this.observers.push(
          this.bankService
            .getAll(this.sort.active, this.sort.direction, this.paginator.pageIndex)
            .subscribe((res) => {
              this.data = res.items
              this.resultsLength = res.total_count
            })
        )
      })
    )
  }

  updateData() {
    this.observers.push(
      this.bankService
        .getAll(this.sort.active, this.sort.direction, this.paginator.pageIndex)
        .subscribe((res) => {
          this.data = res.items
          this.resultsLength = res.total_count
        })
    )
  }
}
