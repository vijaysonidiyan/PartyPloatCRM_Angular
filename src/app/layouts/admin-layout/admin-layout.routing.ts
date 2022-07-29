import { Routes } from '@angular/router';

import { DashboardComponent } from '../../back-office/dashboard/dashboard.component';
import { TableListComponent } from '../../back-office/table-list/table-list.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'table-list',     component: TableListComponent },
];
