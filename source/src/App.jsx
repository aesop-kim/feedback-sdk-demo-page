import { useMemo, useState } from 'react';
import Button from '@lattice-im/design-system/components/buttons/Button/Button';
import Badge from '@lattice-im/design-system/components/data-display/Badge/Badge';
import Icon from '@lattice-im/design-system/components/data-display/Icon/Icon';
import InitialAvatar from '@lattice-im/design-system/components/data-display/InitialAvatar/InitialAvatar';
import CheckboxInput from '@lattice-im/design-system/components/inputs/CheckboxInput/CheckboxInput';
import SearchInput from '@lattice-im/design-system/components/inputs/SearchInput/SearchInput';
import SelectInput from '@lattice-im/design-system/components/inputs/SelectInput/SelectInput';

const CUSTOMERS = ['한빛상사', '세라트젠', '오름기획', '누리테크', '다온물산', '가람전자', '미르건설', '새솔유통'];
const MENUS = [
  { icon: 'SquaresFour', text: '대시보드' },
  { icon: 'FileText', text: '계약서' },
  { icon: 'Folder', text: '프로젝트' },
  { icon: 'Users', text: '고객' },
  { icon: 'Gear', text: '설정' },
];
const PAGE_SIZE_OPTIONS = [5, 10, 100].map((size) => ({ size, label: `${size}개 보기` }));

const createContracts = () =>
  Array.from({ length: 23 }, (_, index) => ({
    id: `DOC-${1001 + index}`,
    title: `${CUSTOMERS[index % CUSTOMERS.length]} 서비스 이용 계약서`,
    customer: CUSTOMERS[index % CUSTOMERS.length],
    amount: 1200000 + index * 370000,
    isConcluded: index % 3 === 0,
  }));

export const App = () => {
  const user = window.DEMO_USER;
  const [contracts, setContracts] = useState(createContracts);
  const [keyword, setKeyword] = useState('');
  const [pageSizeOption, setPageSizeOption] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selectedIds, setSelectedIds] = useState([]);

  const visibleContracts = useMemo(() => {
    const filtered = contracts.filter((contract) => contract.title.startsWith(keyword.trim()));
    return pageSizeOption.size === 100 ? [] : filtered.slice(0, pageSizeOption.size);
  }, [contracts, keyword, pageSizeOption]);

  const handleAdd = () => {
    const customer = CUSTOMERS[contracts.length % CUSTOMERS.length];
    setContracts([
      { id: `DOC-${2001 + contracts.length}`, title: `${customer} 신규 계약서`, customer, amount: 2500000, isConcluded: false },
      ...contracts,
    ]);
  };

  const handleToggle = (id) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]);
  };

  const handleDelete = () => {
    setContracts(contracts.filter((contract) => !selectedIds.includes(contract.id)));
    setSelectedIds([]);
  };

  return (
    <div className="demoApp">
      <nav className="lnb">
        <div className="workspace">
          <span className="workspaceLogo">D</span>
          <span className="workspaceName">데모 주식회사</span>
        </div>
        <ul className="menus">
          {MENUS.map((menu) => (
            <li key={menu.text} className={menu.text === '계약서' ? 'menu selected' : 'menu'}>
              <Icon name={menu.icon} size={18} />
              {menu.text}
            </li>
          ))}
        </ul>
        <div className="profile">
          <InitialAvatar name={user.name} size="2" />
          <div>
            <div className="profileName">{user.name}</div>
            <div className="profileEmail">{user.email}</div>
          </div>
        </div>
      </nav>

      <main className="contents">
        <header className="header">
          <h1 className="title">계약서</h1>
          <div className="headerActions">
            <div className="search">
              <SearchInput submittedValue={keyword} submit={setKeyword} placeholder="계약서명 검색" />
            </div>
            <Button text="새로 만들기" size="2" icon={{ name: 'Plus', position: 'start' }} onClick={handleAdd} />
          </div>
        </header>

        <div className="body">
          <div className="toolbar">
            <span className="count">전체 {contracts.length}건</span>
            <div className="toolbarActions">
              <Button text="선택 삭제" size="2" variant="outline" disabled={!selectedIds.length} onClick={handleDelete} />
              <div className="pageSize">
                <SelectInput
                  itemList={PAGE_SIZE_OPTIONS}
                  displayKey="label"
                  displayValue={pageSizeOption.label}
                  selectItem={setPageSizeOption}
                />
              </div>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th className="checkCell" />
                <th>문서 ID</th>
                <th>계약서명</th>
                <th>고객</th>
                <th className="amountCell">계약 금액</th>
                <th>체결 여부</th>
              </tr>
            </thead>
            <tbody>
              {visibleContracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="checkCell">
                    <CheckboxInput checked={selectedIds.includes(contract.id)} onToggle={() => handleToggle(contract.id)} hasNoPadding />
                  </td>
                  <td className="idCell">{contract.id}</td>
                  <td>{contract.title}</td>
                  <td>{contract.customer}</td>
                  <td className="amountCell">{contract.amount.toLocaleString()}원</td>
                  <td>
                    <Badge
                      variant="soft"
                      size="1"
                      color={contract.isConcluded ? 'success' : 'default'}
                      text={contract.isConcluded ? '체결완료' : '미체결'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleContracts.length && <p className="empty">표시할 계약서가 없습니다.</p>}
        </div>
      </main>
    </div>
  );
};
